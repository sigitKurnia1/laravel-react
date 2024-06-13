import { Link, useNavigate } from "react-router-dom"
import { IoLogOutOutline } from "react-icons/io5"
import axios from "axios"

const AdminNavbar = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            await axios.post("http://localhost:8000/api/logout")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        } catch (error) {
            console.error("Error while logout: ", error)
        }
    }

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/admin" className="btn btn-ghost text-xl text-slate-500">BnB</Link>
            </div>
            <div className="flex-none">
            <details className="dropdown dropdown-end">
                <summary className="m-1 btn btn-ghost text-slate-500">Menu</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-32">
                    <li><Link to="/facility">Facility</Link></li>
                    <li><Link to="/foodcafe">Foodcafe</Link></li>
                    <li><Link to="/hotel">Hotel</Link></li>
                    <li><Link to="/news">News</Link></li>
                </ul>
            </details>
            <button onClick={handleLogout} className="btn btn-ghost">
                <IoLogOutOutline className="text-error" size={25} />
                <span className="text-slate-500">Logout</span>
            </button>
            </div>
        </div>
    )
}

export default AdminNavbar
