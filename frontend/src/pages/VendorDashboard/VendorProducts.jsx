import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";
import { FaPlus } from "react-icons/fa";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const STATUS_BADGE = ({ value }) => {
  const label =
    value === true
      ? "Active"
      : value === false
        ? "Inactive"
        : (value ?? "Pending");

  const cls =
    label === "Active"
      ? "bg-green-100 text-green-800 border-green-200"
      : label === "Inactive"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-stone-100 text-stone-700 border-stone-200";

  return (
    <span className={`px-2 py-0.5 text-xs border rounded ${cls}`}>{label}</span>
  );
};

function MenuPortal({ anchorRect, onClose, children, align = "right" }) {
  if (!anchorRect) return null;

  const MENU_W = 180;
  const top = anchorRect.bottom + window.scrollY + 4;
  const left =
    align === "right"
      ? anchorRect.right + window.scrollX - MENU_W
      : anchorRect.left + window.scrollX;

  return createPortal(
    <>
      {/* Click-away overlay BEHIND the menu */}
      <div className="fixed inset-0 z-[999] bg-transparent" onClick={onClose} />
      {/* Menu panel ABOVE the overlay */}
      <div className="fixed z-[1000]" style={{ top, left, width: MENU_W }}>
        <div className="rounded border bg-white shadow">{children}</div>
      </div>
    </>,
    document.body,
  );
}

const VendorProducts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  // dropdown portal state
  const [menuForId, setMenuForId] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);

  const openModal = (product, action) => {
    setModalProduct(product);
    setModalAction(action);
    setModalVisible(true);
  };

  const handleConfirmModal = async (product, action) => {
    setModalVisible(false);

    if (action === "delete") {
      const prev = products;
      setProducts((list) => list.filter((p) => p.id !== product.id));
      try {
        await api.delete(`/products/${product.id}/`);
      } catch (err) {
        console.error("Failed to delete", err);
        setProducts(prev);
        alert("Delete failed. Please try again.");
      }
    } else if (action === "deactivate") {
      const next = !product.active;
      const prev = products;

      setProducts((list) =>
        list.map((p) => (p.id === product.id ? { ...p, active: next } : p)),
      );

      try {
        await api.patch(`/products/${product.id}/`, { active: next });
      } catch (err) {
        console.error("Failed to update active", err);
        setProducts(prev);
        alert("Update failed. Please try again.");
      }
    }
  };

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products/", { signal });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.name !== "CanceledError") setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  useEffect(() => {
    const close = () => setMenuForId(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQ =
        !q ||
        String(p.id).includes(q) ||
        (p.name || "").toLowerCase().includes(q);
      const normalizedStatus =
        p.active === true
          ? "active"
          : p.active === false
            ? "inactive"
            : (p.status || "pending").toLowerCase();
      const matchesS = status === "all" || normalizedStatus === status;
      return matchesQ && matchesS;
    });
  }, [products, query, status]);

  // DELETE (same idea, no field changes needed)
  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    const prev = products;
    setProducts((list) => list.filter((p) => p.id !== productId));
    try {
      await api.delete(`/products/${productId}/`);
    } catch (err) {
      console.error("Failed to delete", err);
      setProducts(prev);
      alert("Delete failed. Please try again.");
    }
  };

  const handleToggleActive = async (product) => {
    const next = !product.active;
    const prev = products;

    // Optimistic update
    setProducts((list) =>
      list.map((p) => (p.id === product.id ? { ...p, active: next } : p)),
    );

    try {
      // Send PATCH request to toggle active field
      await api.patch(`/products/${product.id}/`, { active: next });
    } catch (err) {
      console.error("Failed to update active", err);
      setProducts(prev); // rollback
      alert("Failed to update product status. Please try again.");
    }
  };

  const openMenu = (id, btnEl) => {
    setMenuForId(id);
    setAnchorRect(btnEl.getBoundingClientRect());
  };

  return (
    <div className="rounded-lg shadow h-full overflow-y-auto relative bg-white">
      <Topbar />

      {/* Header + Filters */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold mb-3">List of All Products</h1>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-stone-600 mb-1">
              Search by Name / ID
            </label>
            <input
              className="h-9 w-64 rounded border px-2 text-sm"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-stone-600 mb-1">
              Search by Status
            </label>
            <select
              className="h-9 w-48 rounded border px-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Not Active</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchProducts()}
            className="h-9 px-4 rounded border bg-stone-50 text-sm"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        {loading ? (
          <div className="text-sm text-stone-600">Loading products…</div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border border-stone-200 text-sm">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-3 py-2 text-left border-b">ID</th>
                  <th className="px-3 py-2 text-left border-b">Name</th>
                  <th className="px-3 py-2 text-left border-b">Product Tags</th>
                  <th className="px-3 py-2 text-left border-b">Image</th>
                  <th className="px-3 py-2 text-left border-b">
                    Product Price
                  </th>
                  <th className="px-3 py-2 text-left border-b">
                    Qty Available
                  </th>
                  <th className="px-3 py-2 text-left border-b">Status</th>
                  <th className="px-3 py-2 text-left border-b">Actions</th>
                  <th className="px-3 py-2 text-left border-b w-0" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={idx % 2 === 1 ? "bg-green-50/50" : "bg-white"}
                  >
                    <td className="px-3 py-2 border-b align-top">{p.id}</td>

                    <td className="px-3 py-2 border-b align-top">
                      <div className="leading-tight">
                        <div className="font-medium">{p.name || "—"}</div>
                        <div className="text-xs text-stone-500 line-clamp-1 max-w-[360px]">
                          {p.description || " "}
                        </div>
                      </div>
                    </td>

                    {/* Product Tags column (replaces Product Type) */}
                    <td className="px-3 py-2 border-b align-top">
                      <div className="flex flex-wrap gap-1">
                        {(p.tags ?? p.product_tags ?? []).length
                          ? (p.tags ?? p.product_tags).map((t, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs border rounded bg-stone-50"
                              >
                                {String(t)}
                              </span>
                            ))
                          : "—"}
                      </div>
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      {p.thumbnail ? (
                        <a
                          href={p.thumbnail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      {p.default_price
                        ? php.format(Number(p.default_price))
                        : "-"}
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      {p.quantity ?? 0}
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      <STATUS_BADGE value={p.active} />
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      <a
                        href={`/products/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border px-2 py-1 text-xs"
                      >
                        Preview
                      </a>
                    </td>

                    <td className="px-3 py-2 border-b align-top">
                      <button
                        type="button"
                        className="rounded border px-2 py-1 text-xs"
                        onClick={(e) => openMenu(p.id, e.currentTarget)}
                      >
                        More Options ▾
                      </button>

                      {menuForId === p.id && (
                        <MenuPortal
                          anchorRect={anchorRect}
                          onClose={() => setMenuForId(null)}
                          align="right"
                        >
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50"
                            onClick={() => {
                              setMenuForId(null);
                              openModal(p, "deactivate");
                            }}
                          >
                            {p.active ? "Deactivate" : "Activate"}
                          </button>
                          <a
                            href={`/vendor-dashboard/products/edit/${p.id}`}
                            className="block px-3 py-2 text-sm hover:bg-stone-50"
                            onClick={() => setMenuForId(null)}
                          >
                            Edit
                          </a>
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 text-red-600"
                            onClick={() => {
                              setMenuForId(null);
                              openModal(p, "delete");
                            }}
                          >
                            Delete
                          </button>
                        </MenuPortal>
                      )}
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-6 text-center text-stone-600"
                    >
                      No products found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <a
        href="/vendor-dashboard/products/add"
        className="absolute text-xl bottom-4 right-4 cursor-pointer"
        aria-label="Add product"
        title="Add product"
      >
        <FaPlus className="text-black" />
      </a>

      <ConfirmModal
        visible={modalVisible}
        product={modalProduct}
        action={modalAction}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default VendorProducts;
