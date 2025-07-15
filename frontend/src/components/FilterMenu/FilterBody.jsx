import { useState } from "react";
import { IoIosOptions, IoMdClose } from "react-icons/io";

const FilterBody = ({
  sortOption,
  setSortOption,
  selectedCategories,
  setSelectedCategories,
  onApply,
  handleClose,
}) => {
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  return (
    <div
      id="body-container"
      className="flex flex-col pt-2 px-4 text-[#FAF9F6] whitespace-nowrap overflow-hidden"
    >
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
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-4">
        <label className="uppercase satoshi block mb-2">Sort By</label>
        <div className="flex flex-col gap-2">
          <label>
            <input
              type="radio"
              name="sort"
              value="price-asc"
              checked={sortOption === "price-asc"}
              onChange={() => setSortOption("price-asc")}
              className="mr-10"
            />
            Price: Low to High
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="price-desc"
              checked={sortOption === "price-desc"}
              onChange={() => setSortOption("price-desc")}
              className="mr-2"
            />
            Price: High to Low
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="first"
              checked={sortOption === "first"}
              onChange={() => setSortOption("first")}
              className="mr-2"
            />
            First Releases
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="latest"
              checked={sortOption === "latest"}
              onChange={() => setSortOption("latest")}
              className="mr-2"
            />
            Latest Arrivals
          </label>
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="uppercase satoshi block mb-2">Category</label>
        <div className="flex flex-col gap-2">
          {["Home", "Angels"].map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mr-2"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Apply Button */}
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
