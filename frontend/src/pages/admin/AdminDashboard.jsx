import { useNavigate } from "react-router-dom"
import AdminFooter from "../../components/admin/AdminFooter"
import AdminNavbar from "../../components/admin/AdminNavbar"
import CardSummary from "../../components/admin/CardSummary"
import { useRef, useState, useEffect } from "react"
import { useIdleTimer } from "react-idle-timer"
import refreshToken from "../../utils/Utils"
import IdleModal from "../../components/IdleModal"

const AdminDashboard = () => {
    const [isIdle, setIsIdle] = useState(false)
    const idleTimerRef = useRef(null)
    const timeoutRef = useRef(null)
    const navigate = useNavigate()

    const onIdle = () => {
        setIsIdle(true)
        startWarningTimer()
    }

    const startWarningTimer = () => {
        timeoutRef.current = setTimeout(() => {
            handleSessionOut()
        }, 20000)
    }

    const clearWarningTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    useEffect(() => {
        if (!isIdle) {
            clearWarningTimer()
        }
    }, [isIdle])

    useIdleTimer({
        ref: idleTimerRef,
        timeout: 10 * 60 * 1000,
        onIdle: onIdle,
        debounce: 500
    })

    const handleSessionContinue = async () => {
        refreshToken()
        setIsIdle(false)
        clearWarningTimer()
    }

    const handleSessionOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsIdle(false)
        clearWarningTimer()
        navigate('/')
    }

    return (
        <>
            <AdminNavbar />
            <div className="grid justify-items-center grid-cols-1 md:grid-cols-3 p-5 gap-5">
                <CardSummary image={"https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} title={"List of Facility"} description={"List of Facility"} link={"/facility"} />
                <CardSummary image={"https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} title={"List of Food Cafe"} description={"List of Food Cafe"} link={"/foodcafe"} />
                <CardSummary image={"https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} title={"List of Hotel"} description={"List of Hotel"} link={"/hotel"} />
                <CardSummary image={"https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"} title={"List of News"} description={"List of News"} link={"/news"} />
            </div>
            <AdminFooter />
            {
                isIdle && (
                    <IdleModal modalId="modal_idle" sessionOut={handleSessionOut} sessionContinue={handleSessionContinue} />
                )
            }
        </>
    )
}

export default AdminDashboard
