import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

// eslint-disable-next-line react/prop-types
const AuthMiddleware = ({component, role}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }

        setLoading(false)
    }, [])

    if (loading) {
        return <span className="loading loading-spinner loading-lg"></span>
    }

    if (!user) {
        return <Navigate to="/" />
    }

    if (role === 'admin' && user.role !== 'admin') {
        return <Navigate to="/user" />
    }

    if (role === 'user' && user.role !== 'user') {
        return <Navigate to="/admin" />
    }

    return component
}

export default AuthMiddleware
