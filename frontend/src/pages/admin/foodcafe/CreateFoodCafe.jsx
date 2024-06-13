import { useState, useRef, useEffect } from "react"
import AdminFooter from "../../../components/admin/AdminFooter"
import AdminNavbar from "../../../components/admin/AdminNavbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { CiCirclePlus, CiClock2 } from "react-icons/ci"
import { LuHotel } from "react-icons/lu"
import { RiPinDistanceLine } from "react-icons/ri"
import { Link } from "react-router-dom"
import { IoBackspaceOutline } from "react-icons/io5"
import { useIdleTimer } from "react-idle-timer"
import refreshToken from "../../../utils/Utils"
import IdleModal from "../../../components/IdleModal"

const CreateFoodCafe = () => {
    const [formData, setFormData] = useState({
        image: null,
        name: "",
        distance: "",
        close: "",
        open: "",
        narration: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
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

    const handleChange = (e) => {
        const {name, value, type, files} = e.target
        if (type === "file") {
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

    const addFoodCafeHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()

        data.append("image", formData.image)
        data.append("name", formData.name)
        data.append("distance", formData.distance)
        data.append("close", formData.close)
        data.append("open", formData.open)
        data.append("narration", formData.narration)

        try {
            await axios.post("http://127.0.0.1:8000/api/foodcafe", data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
            navigate("/foodcafe")
        } catch (error) {
            console.error("Error while creating hotel: ", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AdminNavbar />
            <div className="h-screen">
                <div className="grid justify-center mt-1">
                    <div className="card w-[550px] bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p className="text-center text-xl font-semibold">Create FoodCafe</p>
                            <form className="mt-5" onSubmit={addFoodCafeHandler}>
                                <label className="input input-bordered flex items-center gap-2 mb-5">
                                    <LuHotel className="text-slate-300" size={25} />
                                    <input name="name" type="text" className="grow" placeholder="FoodCafe Name" onChange={handleChange}/>
                                </label>
                                <label className="input input-bordered flex items-center gap-2 mb-5">
                                    <RiPinDistanceLine className="text-slate-300" size={25} />
                                    <input name="distance" type="number" className="grow" placeholder="FoodCafe Distance" onChange={handleChange}/>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="input input-bordered flex items-center gap-2 mb-5">
                                        <CiClock2 className="text-slate-300" size={25} />
                                        <input name="open" type="text" className="grow" placeholder="Open Time 00:00" onChange={handleChange}/>
                                    </label>
                                    <label className="input input-bordered flex items-center gap-2 mb-5">
                                        <CiClock2 className="text-slate-300" size={25} />
                                        <input name="close" type="text" className="grow" placeholder="Close Time 00:00" onChange={handleChange}/>
                                    </label>
                                </div>
                                <textarea name="narration" className="textarea textarea-bordered mb-3.5" placeholder="FoodCafe Narration" cols={66} rows={3} onChange={handleChange}></textarea>
                                <input type="file" className="file-input file-input-bordered w-full" name="image" onChange={handleChange}/>
                                <div className="grid grid-cols-2 gap-5 mt-8">
                                    <Link to="/foodcafe" className="btn btn-outline">
                                        <IoBackspaceOutline size={25} /> Cancel
                                    </Link>
                                    {
                                        loading ? (
                                            <button className="btn btn-outline btn-primary">
                                                <span className="loading loading-spinner loading-xs"></span>Add
                                            </button>
                                        ) : (
                                            <button className="btn btn-outline btn-primary">
                                                <CiCirclePlus size={25} />Add
                                            </button>
                                        )
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
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

export default CreateFoodCafe
