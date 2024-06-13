import axios from "axios"

const refreshToken = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/refresh-token", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        const newToken = response.data.token
        localStorage.setItem('token', newToken)
        return true
    } catch (error) {
        return false
    }
}

export default refreshToken