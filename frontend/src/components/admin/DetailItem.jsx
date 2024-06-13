// eslint-disable-next-line react/prop-types
const DetailItem = ({image, name, distance, open, close, narration}) => {
    return (
        <div className="card w-96 md:w-[600px] bg-base-100 shadow-xl">
            <figure><img src={ image } alt="Hotel Image" /></figure>
            <div className="card-body">
                <h2 className="card-title mb-3">{ name }</h2>
                <p>{ narration }</p>
                <div className="grid grid-cols-2 mt-3">
                    <p>Close: { open }</p>
                    <p>Open: { close }</p>
                </div>
                <p className="mt-3">Hotel Distance: { distance }</p>
            </div>
        </div>
    )
}

export default DetailItem
