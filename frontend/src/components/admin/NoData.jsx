import { FaSadTear } from "react-icons/fa"
import { CiCirclePlus } from "react-icons/ci"
import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const NoData = ({title, desc, link}) => {
    return (
        <div className="card w-96 bg-white text-slate-500">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{ title }</h2>
                <p>{ desc }</p>
                <FaSadTear size={30} />
                <Link to={ link } className="btn btn-outline mt-4">
                    <CiCirclePlus size={25} />Add Item
                </Link>
            </div>
        </div>
    )
}

export default NoData
