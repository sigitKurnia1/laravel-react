import { FaSadTear } from "react-icons/fa"
import { IoBackspaceOutline } from "react-icons/io5"
import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const Error = ({title, desc, link}) => {
    return (
        <div className="card w-96 bg-white text-slate-500">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{ title }</h2>
                <p>{ desc }</p>
                <FaSadTear size={30} />
                <Link to={ link } className="btn btn-outline mt-4">
                    <IoBackspaceOutline size={25} />Go Back
                </Link>
            </div>
        </div>
    )
}

export default Error
