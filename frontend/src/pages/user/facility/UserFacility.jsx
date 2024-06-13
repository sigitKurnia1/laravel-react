import UserNavbar from "../../../components/user/UserNavbar"
import UserFooter from "../../../components/user/UserFooter"
import UserItem from "../../../components/user/UserItem"
import { useState, useEffect } from "react"
import axios from "axios"
import UserNoData from "../../../components/user/UserNoData"

const UserFacility = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [currentPage, setCurrentpage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [hasPrevPage, setHasPrevPage] = useState(false)
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const fetchData = async () => {
        setLoading(true)

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/facility?page=${currentPage}`, {
                "Authorization": `Bearer ${token}`
            })
            setData(response.data.data.data)
            setHasNextPage(!!response.data.data.next_page_url)
            setHasPrevPage(!!response.data.data.prev_page_url)
        } catch (error) {
            console.error("Error while fetching data: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentpage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setCurrentpage(currentPage - 1)
        }
    }

    return (
        <>
            <UserNavbar />
            <div className="flex flex-col min-h-screen">
                <div className="grid justify-items-center grid-cols-1 md:grid-cols-3 p-5 gap-5">
                    {
                        loading ? (
                            <span className="loading loading-spinner loading-lg col-span-3 my-10 text-slate-500"></span>
                        ) : (
                            data.length > 0 ? (
                                data.map((item) => (
                                    <>
                                        <div key={item.id} className="col-span-3 md:col-span-1">
                                            <UserItem image={item.image} title={item.name} description={item.narration} detailLink={`#`} />
                                        </div>
                                    </>
                                ))
                            ) : (
                                <div className="col-span-3">
                                    <UserNoData title="Sorry!" desc="No Data Available" />
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
            <UserFooter />
        </>
    )
}

export default UserFacility
