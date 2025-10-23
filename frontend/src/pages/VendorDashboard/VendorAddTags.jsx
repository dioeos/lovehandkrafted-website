// src/pages/VendorDashboard/VendorAddTags.jsx
import { useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";

const VendorAddTags = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a tag name.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/tags/", { name: trimmed });
      // success UI
      setSuccess(true);
      setName("");
      // If you want to redirect, do it here
      // window.location.href = "/vendor-dashboard/tags";
    } catch (err) {
      // Try to surface server-side validation message if present
      const detail =
        err?.response?.data?.name?.[0] ||
        err?.response?.data?.detail ||
        "Something went wrong while creating the tag.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg shadow h-full overflow-y-auto bg-white">
      <Topbar />

      <div className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6 text-stone-800">
          Add New Tag
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
            {String(error)}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
            Tag successfully created!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tag Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tag Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Handmade, Jewelry, Leather"
              autoFocus
            />
            <p className="mt-1 text-xs text-stone-500">
              Only the name is required to create a tag.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Adding Tag..." : "Add Tag"}
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setError(null);
                setSuccess(false);
              }}
              className="px-4 py-2.5 border border-stone-300 rounded-lg hover:bg-stone-50 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAddTags;
