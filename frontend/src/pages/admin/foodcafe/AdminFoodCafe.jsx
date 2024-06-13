import AdminNavbar from "../../../components/admin/AdminNavbar"
import AdminFooter from "../../../components/admin/AdminFooter"
import Item from "../../../components/admin/Item"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import NoData from "../../../components/admin/NoData"
import { Link, useNavigate } from "react-router-dom"
import { CiCirclePlus } from "react-icons/ci"
import { useIdleTimer } from "react-idle-timer"
import IdleModal from "../../../components/IdleModal"
import refreshToken from "../../../utils/Utils"

const AdminFoodCafe = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const token = localStorage.getItem('token')
    const [isIdle, setIsIdle] = useState(false)
    const idleTimerRef = useRef(null)
    const timeoutRef = useRef(null)
    const navigate = useNavigate()

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

    useEffect (() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const fetchData = async () => {
        setLoading(true)

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/foodcafe?page=${currentPage}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setData(response.data.data.data)
            setHasNextPage(response.data.data.next_page_url)
            setHasPrevPage(response.data.data.prev_page_url)
        } catch (error) {
            console.error("Error while fetching data: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/foodcafe/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            fetchData()
        } catch (error) {
            console.error("Error when deleteing data: ", error)
        }
    }

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <>
            <AdminNavbar />
            <div className="flex flex-col min-h-screen ">
                <div className="grid justify-items-center grid-cols-1 md:grid-cols-3 p-5 gap-5">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500"></span>
                        ) : (
                            data.length > 0 ? (
                                <>
                                    <div className="col-span-3">
                                        <Link to="/add-foodcafe" className="btn btn-primary">
                                            <CiCirclePlus size={25} />Add Hotel
                                        </Link>
                                    </div>
                                    {
                                        data.map((item, index) => (
                                            <div key={index} className="col-span-3 md:col-span-1">
                                                <Item image={item.image} title={item.name} description={item.narration} detailLink={`/detail-foodcafe/${item.id}`} updateLink={`/update-foodcafe/${item.id}`} deleteItem={() => handleDelete(item.id)} />
                                            </div>
                                        ))
                                    }
                                </>
                            ) : (
                                <div className="col-span-3">
                                    <NoData title="Sorry!" desc="No Data Available" link="/add-foodcafe" />
                                </div>
                            )
                        )
                    }
                    {
                        !loading && data.length > 0 && (
                            <div className="md:col-span-3 w-96 flex justify-center my-10">
                                <div className="join grid grid-cols-2 w-full md:w-auto">
                                    <button className="join-item btn btn-outline" onClick={handlePrevPage} disabled={!hasPrevPage}>Previous Page</button>
                                    <button className="join-item btn btn-outline" onClick={handleNextPage} disabled={!hasNextPage}>Next Page</button>
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

export default AdminFoodCafe
