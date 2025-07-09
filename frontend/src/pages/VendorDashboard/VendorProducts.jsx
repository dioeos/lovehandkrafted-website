import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}/`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId),
      );
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <div className="rounded-lg shadow h-full overflow-y-auto relative bg-white">
      <Topbar />

      <div className="p-4 space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-stone-100 p-4 rounded-lg flex flex-wrap justify-between items-start gap-4"
          >
            <div id="edit-options" className="flex flex-col items-start gap-1">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Options
              </label>
              <div className="flex flex-row gap-3">
                <button
                  className="cursor-pointer"
                  onClick={() => handleDelete(product.id)}
                >
                  <FaTrash className="text-black" />
                </button>
                <a className="cursor-pointer" href="#">
                  <FaEdit className="text-black" />
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex flex-col items-start gap-1">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Thumbnail
              </label>
              <a
                href={product.thumbnail}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Image
              </a>
            </div>

            {/* Quantity Section */}
            <div className="flex-1 flex flex-col items-start gap-1 min-w-[120px]">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Quantity
              </label>
              <p>{product.quantity}</p>
            </div>

            {/* Name Section */}
            <div className="flex-1 flex flex-col items-start gap-1 min-w-[120px]">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Name
              </label>
              <p>{product.name}</p>
            </div>

            {/* Description Section */}
            <div className="flex-1 flex flex-col items-start gap-1 min-w-[150px]">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Description
              </label>
              <p>{product.description}</p>
            </div>

            {/* Price Section */}
            <div className="flex-1 flex flex-col items-start gap-1 min-w-[100px]">
              <label className="text-[#352f36] font-medium text-sm md:text-base">
                Price
              </label>
              <p>{product.default_price} Pesos</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <a
        href="/vendor-dashboard/products/add"
        className="absolute text-xl bottom-4 right-4 cursor-pointer"
      >
        <FaPlus className="text-black" />
      </a>
    </div>
  );
};

export default VendorProducts;
