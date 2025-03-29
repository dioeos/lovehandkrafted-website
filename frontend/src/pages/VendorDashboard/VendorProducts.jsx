
import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";

const VendorProducts = () => {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                //get request for products
                const response = await api.get('/products');
                console.log(response);
                setProducts(response.data);
            } catch (error) {
                console.error(error)
            }
        }
        fetchProducts();    
    }, []);

    return (

        <div className="rounded-lg shadow h-full overflow-y-auto">
            <Topbar />

            <div className="bg-amber-400">
                {/* Header Row */}
                {/* <div className="grid grid-cols-5 gap-4 text-start font-semibold bg-red-500">
                    <div className="bg-blue-500">IMAGE</div>
                    <div>Qty</div>
                    <div>Name</div>
                    <div>Description</div>
                    <div>Price</div>
                </div>

                {/* Products List */}
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-stone-100 p-3 rounded-lg flex items-center justify-between space-x-4"
                    >
                        {/* Image Section */}
                        <div className="p-0.5 flex justify-center items-center">
                            <img src={product.thumbail} />
                        </div>

                        {/* Quantity Section */}
                        <div className="flex-1 p-0.5 flex justify-center items-center">
                            <p>{product.quantity}</p>
                        </div>

                        {/* Name Section */}
                        <div className="flex-1 p-0.5">
                            <p>{product.name}</p>
                        </div>

                        {/* Description Section */}
                        <div className="flex-1 p-0.5">
                            <p>{product.description}</p>
                        </div>

                        {/* Price Section */}
                        <div className="p-0.5">
                            <p>{product.default_price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default VendorProducts;
