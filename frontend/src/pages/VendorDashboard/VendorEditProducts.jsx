import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";
import { useParams, useNavigate } from "react-router-dom";

const VendorEditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [tags, setTags] = useState([""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product.");
      }
    };
    fetchProduct();
  }, [id]);

  // Populate state when product is loaded
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setDefaultPrice(product.default_price);
      setExistingImage(product.thumbnail);
      setQuantity(product.quantity);
      setTags(product.tags?.map((tag) => tag.name) || [""]);
    }
  }, [product]);

  const handleTagChange = (e, index) => {
    const newTags = [...tags];
    newTags[index] = e.target.value;
    setTags(newTags);
  };

  const handleAddTag = () => setTags([...tags, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedTags = tags.map((tag) => ({ name: tag.trim() }));

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("default_price", defaultPrice);
    formData.append("quantity", quantity);
    formData.append("tags", JSON.stringify(formattedTags));

    if (imageChanged && imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await api.patch(`/products/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/vendor-dashboard/products");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg shadow bg-white min-h-screen">
      <Topbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Default Price
            </label>
            <input
              type="number"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            {existingImage && !imageChanged && (
              <div className="mt-2 space-y-2">
                <img
                  src={existingImage}
                  alt="Current product"
                  className="h-32 w-auto object-cover border rounded"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImageChanged(true);
                    }}
                    className="text-blue-500 text-sm underline"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
            {imageChanged && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
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
                      const updatedTags = tags.filter((_, i) => i !== index);
                      setTags(updatedTags);
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

          {/* Submit */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorEditProducts;
