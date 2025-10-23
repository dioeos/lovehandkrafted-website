import { useEffect, useMemo, useState } from "react";
import { IoIosOptions, IoMdClose } from "react-icons/io";
import api from "../../utils/lib/api";

const FilterBody = ({
  sortOption,
  setSortOption,
  selectedCategories,
  setSelectedCategories,
  onApply,
  handleClose,
}) => {
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagsError, setTagsError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingTags(true);
        setTagsError("");
        const res = await api.get("/tags/");
        if (!alive) return;

        const raw = Array.isArray(res?.data) ? res.data : [];
        const normalized = raw
          .map((t) => (typeof t === "string" ? t : (t?.name ?? t?.slug ?? "")))
          .filter(Boolean);

        const uniqueSorted = Array.from(new Set(normalized)).sort((a, b) =>
          a.localeCompare(b),
        );

        setTags(uniqueSorted);
      } catch {
        if (alive) setTagsError("Couldn’t load tags.");
      } finally {
        if (alive) setLoadingTags(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const visibleTags = useMemo(() => {
    if (expanded) return tags;
    return tags.slice(0, 10); // first 10 collapsed view
  }, [tags, expanded]);

  const handleToggleTag = (tag) => {
    setSelectedCategories((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div
      id="body-container"
      className="flex flex-col pt-2 px-4 text-[#FAF9F6] whitespace-nowrap overflow-hidden"
    >
      {/* Header */}
      <div id="filter-header" className="flex uppercase satoshi pt-2">
        <div className="flex items-center justify-between satoshi mb-2 w-full pl-10 pr-3">
          <div className="flex items-center gap-2 uppercase">
            <IoIosOptions />
            Filter
          </div>
          <div className="right-0">
            <IoMdClose
              className="cursor-pointer text-4xl"
              onClick={handleClose}
              aria-label="Close filters"
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <label className="uppercase satoshi block mb-2">Sort By</label>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="price-asc"
              checked={sortOption === "price-asc"}
              onChange={() => setSortOption("price-asc")}
              className="mr-2 accent-black"
            />
            Price: Low to High
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="price-desc"
              checked={sortOption === "price-desc"}
              onChange={() => setSortOption("price-desc")}
              className="mr-2 accent-black"
            />
            Price: High to Low
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="first"
              checked={sortOption === "first"}
              onChange={() => setSortOption("first")}
              className="mr-2 accent-black"
            />
            First Releases
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="sort"
              value="latest"
              checked={sortOption === "latest"}
              onChange={() => setSortOption("latest")}
              className="mr-2 accent-black"
            />
            Latest Arrivals
          </label>
        </div>
      </div>

      {/* Tags (dynamic, checkboxes only) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="uppercase satoshi">Tags</label>
          <button
            onClick={clearFilters}
            disabled={selectedCategories.length === 0}
            className="text-xs underline underline-offset-2 disabled:opacity-40 hover:opacity-90"
            title="Clear selected tags"
          >
            Clear Filters
          </button>
        </div>

        <div className="mb-2 text-xs opacity-80">
          {loadingTags ? "Loading…" : `${tags.length} available`}
          {tagsError && <span className="ml-2 text-red-300">{tagsError}</span>}
        </div>

        <div
          className="flex flex-col gap-2 pr-2 overflow-y-auto"
          style={{ maxHeight: 220 }}
          role="group"
          aria-label="Filter by tags"
        >
          {loadingTags && (
            <>
              <div className="h-4 w-32 bg-white/20 rounded" />
              <div className="h-4 w-40 bg-white/20 rounded" />
              <div className="h-4 w-28 bg-white/20 rounded" />
            </>
          )}

          {!loadingTags && tags.length === 0 && !tagsError && (
            <div className="text-sm opacity-80">No tags found.</div>
          )}

          {!loadingTags &&
            visibleTags.map((tag) => (
              <label key={tag} className="cursor-pointer">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedCategories.includes(tag)}
                  onChange={() => handleToggleTag(tag)}
                  className="mr-2 accent-black"
                />
                {tag}
              </label>
            ))}
        </div>

        {!loadingTags && tags.length > 10 && (
          <button
            className="mt-2 text-xs underline underline-offset-2 hover:opacity-90"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `Show all (${tags.length})`}
          </button>
        )}
      </div>

      {/* Apply */}
      <button
        className="mt-auto bg-white text-black py-2 px-4 rounded uppercase satoshi hover:bg-gray-300 transition"
        onClick={onApply}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBody;
