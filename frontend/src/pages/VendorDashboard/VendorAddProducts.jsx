import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";
import { FaPlus, FaTrash } from "react-icons/fa";

const VendorAddProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch all existing tags for dropdown
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/tags/");
        setAvailableTags(res.data);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleAddTag = (e) => {
    const tagId = e.target.value;
    if (!tagId) return;
    const selected = availableTags.find((t) => t.id === tagId);
    if (selected && !tags.some((t) => t.id === tagId)) {
      setTags([...tags, selected]);
    }
  };

  const handleRemoveTag = (id) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("default_price", String(defaultPrice).trim());
      formData.append("quantity", String(quantity).trim());
      if (imageFile) formData.append("image", imageFile);
      const tagsPayload = JSON.stringify(tags.map((t) => ({ name: t.name })));
      formData.append("tags", tagsPayload);

      const response = await api.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setName("");
      setDescription("");
      setDefaultPrice("");
      setQuantity("");
      setImageFile(null);
      setTags([]);
    } catch (err) {
      const data = err?.response?.data;
      console.error("Create product failed:", data || err);
      const firstFieldMsg =
        data?.name?.[0] ??
        data?.description?.[0] ??
        data?.default_price?.[0] ??
        data?.quantity?.[0] ??
        data?.tags?.[0] ??
        data?.image?.[0] ??
        data?.detail ??
        (typeof data === "object" ? JSON.stringify(data) : String(err));
      setError(
        firstFieldMsg || "Something went wrong while creating the product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg shadow h-full overflow-y-auto bg-white">
      <Topbar />

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6 text-stone-800">
          Add New Product
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
            Product successfully created!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Price row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Default Price (₱)
              </label>
              <input
                type="number"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
              placeholder="Describe your product..."
            />
          </div>

          {/* Quantity + Image row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg cursor-pointer bg-stone-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Product Tags
            </label>

            {/* Tag selection dropdown */}
            <div className="flex items-center gap-3 mb-3">
              <select
                onChange={handleAddTag}
                className="w-full md:w-1/2 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a tag...</option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display selected tags */}
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 && (
                <span className="text-sm text-stone-500">
                  No tags selected.
                </span>
              )}
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-1 border border-blue-200 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  <span>{tag.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAddProducts;
