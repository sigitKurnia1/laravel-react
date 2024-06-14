import { useState, useRef, useEffect } from "react"
import IdleModal from "../../../components/IdleModal"
import UserNavbar from "../../../components/user/UserNavbar"
import UserFooter from "../../../components/user/UserFooter"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useIdleTimer } from "react-idle-timer"
import refreshToken from "../../../utils/Utils"
import DetailItem from "../../../components/admin/DetailItem"
import axios from "axios"
import { IoBackspaceOutline } from "react-icons/io5"
import Error from "../../../components/admin/Error"

const UserDetailFacility = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const token = localStorage.getItem('token')
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user-facility-detail/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setData(response.data.data)
            } catch (error) {
                console.error("Error while fetching data: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <>
            <UserNavbar />
            <div className="h-screen">
                <div className="grid grid-cols-1 justify-items-center mt-[90px]">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500"></span>
                        ) : (
                            data ? (
                                <>
                                    <DetailItem image={ data.image } name={ data.name } narration={ data.narration } close={ data.close } open={ data.open } distance={ `${data.distance} Km` } />
                                    <Link to="/user-facility" className="btn btn-outline mt-5">
                                        <IoBackspaceOutline size={25} />Go Back
                                    </Link>
                                </>
                            ) : (
                                <div className="col-span-3">
                                    <Error title="Oops!" desc={`There's something wrong`} link="/user-facility" />
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <UserFooter />
            {
                isIdle && (
                    <IdleModal modalId="modal_idle" sessionOut={handleSessionOut} sessionContinue={handleSessionContinue} />
                )
            }
        </>
    )
}

export default UserDetailFacility
