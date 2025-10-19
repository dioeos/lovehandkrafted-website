import { FaPesoSign } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const Card = ({ productName, thumbnail, price, link }) => {
  return (
    <Link
      to={link}
      className="block w-full p-1 transition-transform duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none"
    >
      <div
        id="card-wrapper"
        className="w-full p-1 transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
      >
        <div className="flex flex-col h-full">
          <div className="w-full aspect-[4/5] overflow-hidden mb-4">
            <img
              src={thumbnail}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col flex-grow justify-between">
            <p className="text-[#352f36] text-base md:text-lg font-semibold mb-2 truncate satoshi">
              {productName}
            </p>
            <div className="text-sm md:text-base text-gray-700 flex items-center gap-1 satoshi">
              {price} PHP
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
