import AdminNavbar from "../../../components/admin/AdminNavbar"
import AdminFooter from "../../../components/admin/AdminFooter"
import { CiCirclePlus, CiClock2 } from "react-icons/ci"
import { LuHotel } from "react-icons/lu"
import { RiPinDistanceLine } from "react-icons/ri"
import { Link, useParams } from "react-router-dom"
import { IoBackspaceOutline } from "react-icons/io5"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Error from "../../../components/admin/Error"
import { useIdleTimer } from "react-idle-timer"
import refreshToken from "../../../utils/Utils"
import IdleModal from "../../../components/IdleModal"
import { toast } from "react-toastify"

const UpdateHotel = () => {
    const [formData, setFormData] = useState({
        name: "",
        distance: "",
        close: "",
        open: "",
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
                const response = await axios.get(`http://127.0.0.1:8000/api/hotel/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = response.data.data
                setFormData({
                    name: data.name,
                    distance: data.distance,
                    close: data.close,
                    open: data.open,
                    narration: data.narration
                })
                setImage(data.image)
            } catch (error) {
                console.error("Error while fetching data: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleChange = (e) => {
        const {name, value, type, files} = e.target

        if (type === 'files') {
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
            data.append('image', image)
        }
        data.append("name", formData.name)
        data.append("distance", formData.distance)
        data.append("close", formData.close)
        data.append("open", formData.open)
        data.append("narration", formData.narration)

        try {
            await axios.post(`http://127.0.0.1:8000/api/hotel/${id}`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            toast.success("Hote updated!")
            navigate("/hotel")
        } catch (error) {
            console.error("Error while updating data: ", error)
            setError(true)
        } finally {
            setUpdateLoading(false)
        }
    }

    return (
        <>
            <AdminNavbar />
            <div className="h-screen">
                <div className="grid grid-cols-1 justify-items-center">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500 mt-[90px]"></span>
                        ) : error ? (
                            <div className="col-span-3">
                                <Error title="Oops!" desc={`There's something wrong`} link="/hotel" />
                            </div>
                        ) : (
                            <div className="card w-[550px] bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <p className="text-center text-xl font-semibold">Update Hotel</p>
                                    <form className="mt-5" onSubmit={handleUpdate}>
                                        <label className="input input-bordered flex items-center gap-2 mb-5">
                                            <LuHotel className="text-slate-300" size={25} />
                                            <input name="name" type="text" className="grow" placeholder="Hotel Name" onChange={handleChange} value={formData.name} />
                                        </label>
                                        <label className="input input-bordered flex items-center gap-2 mb-5">
                                            <RiPinDistanceLine className="text-slate-300" size={25} />
                                            <input name="distance" type="number" className="grow" placeholder="Hotel Distance" onChange={handleChange} value={formData.distance} />
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className="input input-bordered flex items-center gap-2 mb-5">
                                                <CiClock2 className="text-slate-300" size={25} />
                                                <input name="open" type="text" className="grow" placeholder="Open Time 00:00" onChange={handleChange} value={formData.open} />
                                            </label>
                                            <label className="input input-bordered flex items-center gap-2 mb-5">
                                                <CiClock2 className="text-slate-300" size={25} />
                                                <input name="close" type="text" className="grow" placeholder="Close Time 00:00" onChange={handleChange} value={formData.close} />
                                            </label>
                                        </div>
                                        <textarea name="narration" className="textarea textarea-bordered mb-3.5" placeholder="Hotel Narration" cols={66} rows={3} onChange={handleChange} value={formData.narration}></textarea>
                                        <input type="file" className="file-input file-input-bordered w-full" name="image" onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-5 mt-8">
                                            <Link to="/hotel" className="btn btn-outline">
                                                <IoBackspaceOutline size={25} /> Cancel
                                            </Link>
                                            {
                                                updateLoading ? (
                                                    <button className="btn btn-outline btn-primary" disabled>
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

export default UpdateHotel
