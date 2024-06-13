import { MdEdit } from "react-icons/md"
import { FaMagnifyingGlass, FaTrash  } from "react-icons/fa6"
import { Link } from "react-router-dom"
import ModalConfirm from "./ModalConfirm"

/* eslint-disable react/prop-types */
const Item = ({image, title, description, detailLink, updateLink, deleteItem}) => {
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
                <img src={image} alt="Shoes" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions mt-3">
                    <Link to={detailLink} className="btn btn-outline btn-info">
                        <FaMagnifyingGlass />
                        Details
                    </Link>
                    <Link to={updateLink} className="btn btn-outline">
                        <MdEdit />
                        Update
                    </Link>
                    <button onClick={ () => document.getElementById("confirm_modal").showModal() } className="btn btn-outline btn-error">
                        <FaTrash />
                        Delete
                    </button>
                    <ModalConfirm modalId={"confirm_modal"} title={"Delete Item"} modalDesc={"Are you sure want to delete this item?"} clickAction={deleteItem} />
                </div>
            </div>
        </div>
    )
}

export default Item
