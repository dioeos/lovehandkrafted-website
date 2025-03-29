import { useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";

const VendorAddProducts = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [defaultPrice, setDefaultPrice] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [quantity, setQuantity] = useState("");
    const [tags, setTags] = useState([""]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTagChange = (e, index) => {
        const newTags = [...tags];
        newTags[index] = e.target.value;
        setTags(newTags);
    };

    const handleAddTag = () => {
        setTags([...tags, ""]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formattedTags = tags.map(tag => ({ name: tag.trim() }));

        console.log("Request Body:", {
            name: name.trim(),
            description: description.trim(),
            default_price: defaultPrice.trim(),
            thumbnail_url: thumbnailUrl.trim(),
            quantity: quantity.trim(),
            tags: formattedTags
        });

        try {
            const response = await api.post("/products/", {
                name: name.trim(),
                description: description.trim(),
                default_price: defaultPrice.trim(),
                thumbnail_url: thumbnailUrl.trim(),
                quantity: quantity.trim(),
                tags: formattedTags
            });
            console.log(response)
            console.log(response.data);
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg shadow">
            <Topbar />

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

                {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Default Price */}
                    <div className="mb-4">
                        <label htmlFor="default_price" className="block text-sm font-medium text-gray-700">Default Price</label>
                        <input
                            type="number"
                            id="default_price"
                            value={defaultPrice}
                            onChange={(e) => setDefaultPrice(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Thumbnail URL */}
                    <div className="mb-4">
                        <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                        <input
                            type="url"
                            id="thumbnail_url"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        {tags.map((tag, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => handleTagChange(e, index)}
                                    className="mt-1 block w-3/4 px-4 py-2 border border-gray-300 rounded-lg mr-2"
                                    placeholder="Tag"
                                />
                                {tags.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-red-500"
                                        onClick={() => {
                                            const newTags = [...tags];
                                            newTags.splice(index, 1);
                                            setTags(newTags);
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-blue-500"
                            onClick={handleAddTag}
                        >
                            Add Tag
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorAddProducts;
