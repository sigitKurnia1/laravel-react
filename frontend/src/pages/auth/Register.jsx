import { MdEmail } from "react-icons/md"
import { FaLock, FaUser, FaPhoneAlt  } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()

        data.append("full_name", formData.fullName)
        data.append("email", formData.email)
        data.append("phone_number", formData.phoneNumber)
        data.append("password", formData.password)

        try {
            await axios.post("http://127.0.0.1:8000/api/register", data)
            navigate("/")
        } catch (error) {
            console.error("Error while creating account: ", error)
            setError("Failed to creating account, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid justify-center mt-[80px]">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <p className="text-center text-xl font-semibold">Register</p>
                    <form className="mt-5" onSubmit={handleRegister}>
                        <label className="input input-bordered flex items-center gap-2 mb-5">
                            <FaUser className="text-slate-300" size={25} />
                            <input name="fullName" type="text" className="grow" placeholder="Your Fullname" onChange={handleChange} disabled={loading}/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mb-5">
                            <MdEmail className="text-slate-300" size={25} />
                            <input name="email" type="text" className="grow" placeholder="Your Email" onChange={handleChange} disabled={loading}/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 mb-5">
                            <FaPhoneAlt className="text-slate-300" size={25} />
                            <input name="phoneNumber" type="number" className="grow" placeholder="Your Phone Number" onChange={handleChange} disabled={loading}/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaLock className="text-slate-300" size={25} />
                            <input name="password" type="password" className="grow" placeholder="Your Password" onChange={handleChange} disabled={loading}/>
                        </label>
                        <div className="grid mt-8">
                            <button type="submit" className="btn btn-primary">
                                {loading ? (
                                    <span className="loading loading-spinner loading-md"></span>
                                ) : (
                                    <span>Register</span>
                                )}
                            </button>
                            <div className="divider"><span className="text-slate-400">Or</span></div>
                            <Link to="/" className="btn btn-outline">Login</Link>
                        </div>
                    </form>
                    {error && <p className="text-center text-error">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default Register
