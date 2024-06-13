import { Link } from "react-router-dom"
import { FaMagnifyingGlass } from "react-icons/fa6"

// eslint-disable-next-line react/prop-types
const UserItem = ({image, title, description, detailLink}) => {
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
                <img src={image} alt="Image" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions mt-3">
                    <Link to={detailLink} className="btn btn-outline btn-info">
                        <FaMagnifyingGlass />
                        Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UserItem
