import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminFacility from "./pages/admin/facility/AdminFacility"
import AdminHotel from "./pages/admin/hotel/AdminHotel"
import AdminFoodCafe from "./pages/admin/foodcafe/AdminFoodCafe"
import AdminNews from "./pages/admin/news/AdminNews"
import CreateHotel from "./pages/admin/hotel/CreateHotel"
import DetailHotel from "./pages/admin/hotel/DetailHotel"
import UpdateHotel from "./pages/admin/hotel/UpdateHotel"
import CreateFoodCafe from "./pages/admin/foodcafe/CreateFoodCafe"
import UpdateFoodCafe from "./pages/admin/foodcafe/UpdateFoodCafe"
import DetailFoodCafe from "./pages/admin/foodcafe/DetailFoodCafe"
import CreateFacility from "./pages/admin/facility/CreateFacility"
import UpdateFacility from "./pages/admin/facility/UpdateFacility"
import DetailFacility from "./pages/admin/facility/DetailFacility"
import CreateNews from "./pages/admin/news/CreateNews"
import UpdateNews from "./pages/admin/news/UpdateNews"
import DetailNews from "./pages/admin/news/DetailNews"
import UserDashboard from "./pages/user/UserDashboard"
import AuthMiddleware from "./pages/auth/middleware/AuthMiddleware"
import GuestMiddleware from "./pages/auth/middleware/GuestMiddleware"
import UserFacility from "./pages/user/facility/UserFacility"
import UserFoodCafe from "./pages/user/foodcafe/UserFoodCafe"
import UserHotel from "./pages/user/hotel/UserHotel"
import UserNews from "./pages/user/news/UserNews"
import UserDetailFacility from "./pages/user/facility/UserDetailFacility"
import UserDetailFoodCafe from "./pages/user/foodcafe/UserDetailFoodCafe"
import UserDetailHotel from "./pages/user/hotel/UserDetailHotel"
import UserDetailNews from "./pages/user/news/UserDetailNews"
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import { useEffect } from "react"
import axios from "axios"

function App() {
  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem('token')

      if (!token) return

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/refresh-token", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        localStorage.setItem('token', response.data.token)
      } catch (error) {
        console.error("Error while refreshing token: ", error)
      }
    }

    const timeInterval = setInterval(refreshToken, 50 * 60 * 1000)

    return () => clearInterval(timeInterval)
  })

  return (
    <>
      <ToastContainer closeOnClick pauseOnHover={false} />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestMiddleware component={<Login />} />} />
        <Route path="/register" element={<GuestMiddleware component={<Register />} />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AuthMiddleware role="admin" component={<AdminDashboard/>} />} />
        <Route path="/facility" element={<AuthMiddleware role="admin" component={<AdminFacility />} />} />
        <Route path="/hotel" element={<AuthMiddleware role="admin" component={<AdminHotel />} />} />
        <Route path="/foodcafe" element={<AuthMiddleware role="admin" component={<AdminFoodCafe />} />} />
        <Route path="/news" element={<AuthMiddleware role="admin" component={<AdminNews />} />} />
        <Route path="/add-hotel" element={<AuthMiddleware role="admin" component={<CreateHotel />} />} />
        <Route path="/detail-hotel/:id" element={<AuthMiddleware role="admin" component={<DetailHotel />} />} />
        <Route path="/update-hotel/:id" element={<AuthMiddleware role="admin" component={<UpdateHotel />} />} />
        <Route path="/add-foodcafe" element={<AuthMiddleware role="admin" component={<CreateFoodCafe />} />} />
        <Route path="/update-foodcafe/:id" element={<AuthMiddleware role="admin" component={<UpdateFoodCafe />} />} />
        <Route path="/detail-foodcafe/:id" element={<AuthMiddleware role="admin" component={<DetailFoodCafe />} />} />
        <Route path="/add-facility" element={<AuthMiddleware role="admin" component={<CreateFacility />} />} />
        <Route path="/update-facility/:id" element={<AuthMiddleware role="admin" component={<UpdateFacility />} />} />
        <Route path="/detail-facility/:id" element={<AuthMiddleware role="admin" component={<DetailFacility />} />} />
        <Route path="/add-news" element={<AuthMiddleware role="admin" component={<CreateNews />} />} />
        <Route path="/update-news/:id" element={<AuthMiddleware role="admin" component={<UpdateNews />} />} />
        <Route path="/detail-news/:id" element={<AuthMiddleware role="admin" component={<DetailNews />} />} />

        {/* User Route */}
        <Route path="/user" element={<AuthMiddleware role="user" component={<UserDashboard />}/>} />
        <Route path="/user-facility" element={<AuthMiddleware role="user" component={<UserFacility />} />} />
        <Route path="/user-facility-detail/:id" element={<AuthMiddleware role="user" component={<UserDetailFacility />} />} />
        <Route path="/user-foodcafe" element={<AuthMiddleware role="user" component={<UserFoodCafe />} />} />
        <Route path="/user-foodcafe-detail/:id" element={<AuthMiddleware role="user" component={<UserDetailFoodCafe />} />} />
        <Route path="/user-hotel" element={<AuthMiddleware role="user" component={<UserHotel />} />} />
        <Route path="/user-hotel-detail/:id" element={<AuthMiddleware role="user" component={<UserDetailHotel />} />} />
        <Route path="/user-news" element={<AuthMiddleware role="user" component={<UserNews />} />} />
        <Route path="/user-news-detail/:id" element={<AuthMiddleware role="user" component={<UserDetailNews />} />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
