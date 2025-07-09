export const Card = ({ productName, thumbnail, price }) => {
  return (
    <div
      id="card-wrapper"
      className="bg-red-500 p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <div
        id="card-content-container"
        className="bg-blue-500 h-[472px] p-4 rounded-lg"
      >
        <p className="text-white text-lg md:text-xl">{productName}</p>
        <img src={thumbnail} />
        <p className="text-white text-lg md:text-xl">{price}</p>
      </div>
    </div>
  );
};
