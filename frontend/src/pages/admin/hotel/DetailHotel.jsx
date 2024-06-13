import { useEffect, useState, useRef } from "react"
import AdminFooter from "../../../components/admin/AdminFooter"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import DetailItem from "../../../components/admin/DetailItem"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Error from "../../../components/admin/Error"
import { IoBackspaceOutline } from "react-icons/io5"
import IdleModal from "../../../components/IdleModal"
import refreshToken from "../../../utils/Utils"
import { useIdleTimer } from "react-idle-timer"

const DetailHotel = () => {
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
        timeout: 100000,
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

    useEffect (() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${id}`, {
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
            <AdminNavbar />
            <div className="h-screen">
                <div className="grid grid-cols-1 justify-items-center mt-[90px]">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500"></span>
                        ) : (
                            data ? (
                                <>
                                    <DetailItem image={ data.image } name={ data.name } narration={ data.narration } close={ data.close } open={ data.open } distance={ `${data.distance} Km` } />
                                    <Link to="/hotel" className="btn btn-outline mt-5">
                                        <IoBackspaceOutline size={25} />Go Back
                                    </Link>
                                </>
                            )
                             : (
                                <div className="col-span-3">
                                    <Error title="Oops!" desc={`There's something wrong`} link="/hotel" />
                                </div>
                            )
                        )
                    }
                </div>
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

export default DetailHotel
