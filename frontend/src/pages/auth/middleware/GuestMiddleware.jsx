import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const GuestMiddleware = ({component}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    if (loading) {
        return <span className="loading loading-spinner loading-lg"></span>
    }

    if (user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" />
        } else if (user.role === 'user') {
            return <Navigate to="/user" />
        }
    }

    return component
}

export default GuestMiddleware
