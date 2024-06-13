import { useEffect, useState, useRef } from "react"
import AdminFooter from "../../../components/admin/AdminFooter"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Error from "../../../components/admin/Error"
import IdleModal from "../../../components/IdleModal"
import { useIdleTimer } from "react-idle-timer"
import refreshToken from "../../../utils/Utils"

const DetailNews = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/news/${id}`, {
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
                                    <div className="card w-96 md:w-[600px] bg-base-100 shadow-xl">
                                        <figure><img src={data.image} alt="News Image"/></figure>
                                        <div className="card-body">
                                            <h2 className="card-title mb-3">{data.title}</h2>
                                            <p>{data.date}</p>
                                            <p className="mt-3">Hotel Distance: {data.narration}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="col-span-3">
                                    <Error title="Oops!" desc={`There's something wrong`} link="/news" />
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <AdminFooter />
            {
                isIdle && (
                    <IdleModal modalId="modal_idle" sessionContinue={handleSessionContinue} sessionOut={handleSessionOut} />
                )
            }
        </>
    )
}

export default DetailNews
