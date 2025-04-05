
export const Card = ({productName}) => {

    return (
        <div id="card-wrapper" className="bg-red-500 p-2">
            <div id="card-content-container" className="bg-blue-500 h-[472px]"> 
                <p>{productName}</p>
            </div>


        </div>
    )
}