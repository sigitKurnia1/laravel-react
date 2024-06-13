import { FaSadTear } from "react-icons/fa"

// eslint-disable-next-line react/prop-types
const UserNoData = ({title, desc}) => {
    return (
        <div className="card w-96 bg-white text-slate-500">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{ title }</h2>
                <p>{ desc }</p>
                <FaSadTear size={30} />
            </div>
        </div>
    )
}

export default UserNoData
