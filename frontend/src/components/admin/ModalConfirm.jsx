// eslint-disable-next-line react/prop-types
const ModalConfirm = ({modalId, title, modalDesc, clickAction}) => {
    return (
        <dialog id={ modalId } className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{ title }</h3>
                <p className="py-4">{ modalDesc }</p>
                <div className="modal-action flex justify-center">
                    <form method="dialog" className="flex gap-4">
                        <button className="btn">Cancel</button>
                        <button className="btn btn-primary" onClick={ clickAction }>Confirm</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default ModalConfirm
