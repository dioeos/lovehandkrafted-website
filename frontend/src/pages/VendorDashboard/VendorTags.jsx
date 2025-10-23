import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";
import { FaPlus } from "react-icons/fa";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const USAGE_BADGE = ({ used }) => {
  const label = used ? "In Use" : "Unused";
  const cls = used
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-stone-100 text-stone-700 border-stone-200";
  return (
    <span className={`px-2 py-0.5 text-xs border rounded ${cls}`}>{label}</span>
  );
};

function MenuPortal({ anchorRect, onClose, children, align = "right" }) {
  if (!anchorRect) return null;

  const MENU_W = 200;
  const top = anchorRect.bottom + window.scrollY + 4;
  const left =
    align === "right"
      ? anchorRect.right + window.scrollX - MENU_W
      : anchorRect.left + window.scrollX;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999] bg-transparent" onClick={onClose} />
      <div className="fixed z-[1000]" style={{ top, left, width: MENU_W }}>
        <div className="rounded border bg-white shadow">{children}</div>
      </div>
    </>,
    document.body,
  );
}

// Handle DRF-style pagination or plain arrays
function extractItems(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

const VendorTags = () => {
  // data
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | in_use | unused

  // menu/portal state
  const [menuForId, setMenuForId] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);

  // confirm modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTag, setModalTag] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  // per-tag expanded products cache
  // map: tagId -> { loading, error, items: Product[] | null }
  const [linkedProducts, setLinkedProducts] = useState({});

  // mounted guard
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const openModal = (tag, action) => {
    setModalTag(tag);
    setModalAction(action);
    setModalVisible(true);
  };

  const fetchTags = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/tags/", { signal });
      const data = Array.isArray(res.data) ? res.data : extractItems(res.data);
      if (!mountedRef.current) return;
      setTags(data);
    } catch (err) {
      if (err.name !== "CanceledError") setError("Failed to load tags");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchTags(controller.signal);
    return () => controller.abort();
  }, [fetchTags]);

  useEffect(() => {
    const close = () => setMenuForId(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  const openMenu = (id, btnEl) => {
    setMenuForId(id);
    setAnchorRect(btnEl.getBoundingClientRect());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((t) => {
      const matchesQ =
        !q ||
        String(t.id).includes(q) ||
        (t.name || "").toLowerCase().includes(q);

      console.log(t.product_count);
      const used = (t.product_count ?? 0) > 0;
      const normalized = used ? "in_use" : "unused";
      const matchesS = status === "all" || status === normalized;

      return matchesQ && matchesS;
    });
  }, [tags, query, status]);

  const handleConfirmModal = async (tag, action) => {
    setModalVisible(false);
    if (!tag) return;

    if (action === "delete") {
      const prev = tags;
      setTags((list) => list.filter((t) => t.id !== tag.id));
      try {
        await api.delete(`/tags/${tag.id}/`);
      } catch (err) {
        console.error("Failed to delete tag", err);
        setTags(prev);
        alert("Delete failed. Please try again.");
      }
    }
  };

  const toggleExpandProducts = async (tag) => {
    const cur = linkedProducts[tag.id];
    if (cur && cur.items) {
      setLinkedProducts((m) => ({
        ...m,
        [tag.id]: { ...m[tag.id], items: null },
      }));
      return;
    }

    setLinkedProducts((m) => ({
      ...m,
      [tag.id]: { loading: true, error: null, items: null },
    }));

    try {
      // Use M2M filter by default (?tags=<uuid>)
      let res = await api.get(`/products/`, { params: { tags: tag.id } });
      let items = extractItems(res.data);

      // Fallback if your backend only supports tag_id
      if (!items.length) {
        res = await api.get(`/products/`, { params: { tag_id: tag.id } });
        items = extractItems(res.data);
      }

      setLinkedProducts((m) => ({
        ...m,
        [tag.id]: { loading: false, error: null, items },
      }));
    } catch (err) {
      console.error("Failed to load linked products", err);
      setLinkedProducts((m) => ({
        ...m,
        [tag.id]: {
          loading: false,
          error: "Failed to load products",
          items: null,
        },
      }));
    }
  };

  return (
    <div className="rounded-lg shadow h-full overflow-y-auto relative bg-white">
      <Topbar />

      {/* Header + Filters */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold mb-3">List of All Tags</h1>
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
              Filter by Usage
            </label>
            <select
              className="h-9 w-48 rounded border px-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="in_use">In Use</option>
              <option value="unused">Unused</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchTags()}
            className="h-9 px-4 rounded border bg-stone-50 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        {loading ? (
          <div className="text-sm text-stone-600">Loading tags…</div>
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
                  <th className="px-3 py-2 text-left border-b">
                    Linked Products
                  </th>
                  <th className="px-3 py-2 text-left border-b">Usage</th>
                  <th className="px-3 py-2 text-left border-b">Actions</th>
                  <th className="px-3 py-2 text-left border-b w-0" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, idx) => {
                  const lp = linkedProducts[t.id] || {};
                  const isExpanded = !!lp.items;

                  const used = (t.product_count ?? 0) > 0;
                  const displayCount =
                    typeof t.product_count === "number"
                      ? t.product_count
                      : isExpanded && Array.isArray(lp.items)
                        ? lp.items.length
                        : used
                          ? "≥1"
                          : 0;

                  return (
                    <tr
                      key={t.id}
                      className={idx % 2 === 1 ? "bg-stone-50/50" : "bg-white"}
                    >
                      <td className="px-3 py-2 border-b align-top">{t.id}</td>

                      <td className="px-3 py-2 border-b align-top">
                        <div className="leading-tight">
                          <div className="font-medium">{t.name || "—"}</div>
                        </div>
                      </td>

                      <td className="px-3 py-2 border-b align-top">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded border px-2 py-1 text-xs"
                            onClick={() => toggleExpandProducts(t)}
                          >
                            {isExpanded ? "Hide products" : "Show products"}
                          </button>
                          <span className="text-xs text-stone-600">
                            {displayCount} linked
                          </span>
                        </div>
                        {/* Expanded product list */}
                        {lp.loading && (
                          <div className="text-xs text-stone-600 mt-2">
                            Loading…
                          </div>
                        )}
                        {lp.error && (
                          <div className="text-xs text-red-600 mt-2">
                            {lp.error}
                          </div>
                        )}
                        {isExpanded && (
                          <ul className="mt-2 space-y-1 max-h-44 overflow-auto pr-1">
                            {lp.items.length ? (
                              lp.items.map((p) => (
                                <li
                                  key={p.id}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <a
                                    href={`/products/${p.slug ?? p.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-xs"
                                  >
                                    {p.name ?? `Product ${p.id}`}
                                  </a>
                                  <span className="text-[11px] text-stone-500">
                                    ID: {p.id}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-stone-600">
                                No linked products.
                              </li>
                            )}
                          </ul>
                        )}
                      </td>

                      <td className="px-3 py-2 border-b align-top">
                        <USAGE_BADGE used={used} />
                      </td>

                      <td className="px-3 py-2 border-b align-top">
                        <button
                          type="button"
                          className="rounded border px-2 py-1 text-xs"
                          onClick={(e) => openMenu(t.id, e.currentTarget)}
                        >
                          More Options ▾
                        </button>

                        {menuForId === t.id && (
                          <MenuPortal
                            anchorRect={anchorRect}
                            onClose={() => setMenuForId(null)}
                            align="right"
                          >
                            <a
                              href={`/vendor-dashboard/tags/edit/${t.id}`}
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
                                openModal(t, "delete");
                              }}
                            >
                              Delete
                            </button>
                          </MenuPortal>
                        )}
                      </td>

                      <td className="px-3 py-2 border-b align-top">
                        {/* pad */}
                      </td>
                    </tr>
                  );
                })}

                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-center text-stone-600"
                    >
                      No tags found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <a
        href="/vendor-dashboard/tags/add"
        className="absolute text-xl bottom-4 right-4 cursor-pointer"
        aria-label="Add product"
        title="Add product"
      >
        <FaPlus className="text-black" />
      </a>

      <ConfirmModal
        visible={modalVisible}
        product={modalTag}
        action={modalAction}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default VendorTags;
