import AdminNavbar from "../../../components/admin/AdminNavbar"
import AdminFooter from "../../../components/admin/AdminFooter"
import { useEffect, useState, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Error from "../../../components/admin/Error"
import { IoBackspaceOutline } from "react-icons/io5"
import { CiCalendar, CiCirclePlus } from "react-icons/ci"
import { FaRegNewspaper } from "react-icons/fa6"
import refreshToken from "../../../utils/Utils"
import { useIdleTimer } from "react-idle-timer"
import IdleModal from "../../../components/IdleModal"
import { toast } from "react-toastify"

const UpdateNews = () => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        narration: ""
    })
    const [image, setImage] = useState(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()
    const [error, setError] = useState(false)
    const token = localStorage.getItem('token')
    const [isIdle, setIsIdle] = useState(false)
    const idleTimerRef = useRef(null)
    const timeoutRef = useRef(null)

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
                const response = await axios.get(`http://127.0.0.1:8000/api/news/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = response.data.data
                setFormData({
                    title: data.title,
                    date: data.date,
                    narration: data.narration
                })
                setImage(data.image)
            } catch (error) {
                console.error("Error while fetching data: ", error)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e) => {
        const {name, value, type, files} = e.target

        if (type === "files") {
            setFormData({
                ...formData,
                [name]: files[0]
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setUpdateLoading(true)

        const data = new FormData()

        data.append("_method", "PATCH")
        if (image && typeof image !== "string") {
            data.append("image", image)
        }
        data.append("title", formData.title)
        data.append("date", formData.date)
        data.append("narration", formData.narration)

        try {
            await axios.post(`http://127.0.0.1:8000/api/news/${id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            toast.success("News updated!")
            navigate("/news")
        } catch (error) {
            console.error("Error while updating data: ", error)
        } finally {
            setUpdateLoading(false)
        }
    }

    return (
        <>
            <AdminNavbar />
            <div className="h-screen">
                <div className="grid justify-center mt-1">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500 mt-[90px]"></span>
                        ) : error ? (
                            <div className="col-span-3">
                                <Error title="Oops!" desc={`There's something wrong`} link="/news" />
                            </div>
                        ) : (
                            <div className="card w-[550px] bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <p className="text-center text-xl font-semibold">Update News</p>
                                    <form className="mt-5" onSubmit={handleUpdate}>
                                        <label className="input input-bordered flex items-center gap-2 mb-5">
                                            <FaRegNewspaper className="text-slate-300" size={25} />
                                            <input name="title" type="text" className="grow" placeholder="News title" onChange={handleChange} value={formData.title}/>
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2 mb-5">
                                            <CiCalendar className="text-slate-300" size={25} />
                                            <input name="date" type="text" className="grow" placeholder="Publish Date: DD-MM-YYY" onChange={handleChange} value={formData.date}/>
                                        </label>
                                        <textarea name="narration" className="textarea textarea-bordered mb-3.5" placeholder="News Narration" cols={66} rows={3} onChange={handleChange}>{formData.narration}</textarea>
                                        <input type="file" className="file-input file-input-bordered w-full" name="image" onChange={handleChange}/>
                                        <div className="grid grid-cols-2 gap-5 mt-8">
                                            <Link to="/news" className="btn btn-outline">
                                                <IoBackspaceOutline size={25} /> Cancel
                                            </Link>
                                            {
                                                updateLoading ? (
                                                    <button className="btn btn-outline btn-primary">
                                                        <span className="loading loading-spinner loading-xs"></span>Update
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-outline btn-primary">
                                                        <CiCirclePlus size={25} />Update
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
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

export default UpdateNews
