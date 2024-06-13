// eslint-disable-next-line react/prop-types
const IdleModal = ({modalId, sessionOut, sessionContinue}) => {
    return (
        <dialog id={modalId} className="modal" open>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                    Looks like you have been inavtive for a while. Wanna continue stay?
                </p>
                <div className="modal-action">
                    <button className="btn" onClick={sessionOut}>Logout</button>
                    <button className="btn btn-primary" onClick={sessionContinue}>Stay</button>
                </div>
            </div>
        </dialog>
    )
}

export default IdleModal
