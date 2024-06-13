import { Link } from "react-router-dom"

/* eslint-disable react/prop-types */
const CardSummary = ({image, title, description, link}) => {
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure><img src={image} alt="Image"/></figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                    <Link to={link} className="btn btn-outline btn-primary">See Details</Link>
                </div>
            </div>
        </div>
    )
}

export default CardSummary
