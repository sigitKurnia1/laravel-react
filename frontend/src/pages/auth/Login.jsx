import { MdEmail } from "react-icons/md"
import { FaLock } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email, password
            })
            const { token, user } = response.data
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            if (user.role === 'admin') {
                navigate("/admin")
            } else {
                navigate("/user")
            }
        } catch (error) {
            setError("Login failed. Please check your credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid justify-center mt-[80px]">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <p className="text-center text-xl font-semibold">Login</p>
                    <form className="mt-5" onSubmit={handleLogin}>
                        <label className="input input-bordered flex items-center gap-2 mb-5">
                            <MdEmail className="text-slate-300" size={25} />
                            <input name="email" type="text" className="grow" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaLock className="text-slate-300" size={25} />
                            <input name="password" type="password" className="grow" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
                        </label>
                        <div className="grid mt-8">
                            <button type="submit" className="btn btn-primary">
                                {
                                    loading ? (
                                        <span className="loading loading-spinner loading-md"></span>
                                    ) : (
                                        <span>Login</span>
                                    )
                                }
                            </button>
                            <div className="divider"><span className="text-slate-400">Or</span></div>
                            <Link to="/register" className="btn btn-outline">Register</Link>
                        </div>
                    </form>
                    {error && <p className="text-center text-error">{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default Login
