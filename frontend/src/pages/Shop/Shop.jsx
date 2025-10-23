import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Card } from "../../components/Card/Card";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";
import api from "../../utils/lib/api";
import { IoIosOptions } from "react-icons/io";
import FilterMenu from "../../components/FilterMenu/FilterMenu";
import { background } from "./anim.js";

const Shop = () => {
  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        const activeProducts = response.data.filter(
          (product) => product.active === true,
        );
        setProducts(activeProducts);
        setFilteredProducts(activeProducts); //default
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  const handleApplyFilters = () => {
    let result = [...products];
    console.log(result);

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        product.tags.some((tag) => selectedCategories.includes(tag)),
      );
    }

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.default_price - b.default_price);
        break;
      case "price-desc":
        result.sort((a, b) => b.default_price - a.default_price);
        break;
      case "first":
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "latest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredProducts(result);
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-[#352f36]">
      <Nav />
      <div id="shop-wrapper" className="min-h-screen bg-[#FAF9F6]">
        <div id="shop-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="shop-header">
            <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">
              SHOP
            </h1>
          </div>

          <div id="filter-system-container" className="">
            {/* toggle button */}
            <button
              id="filter-system-button"
              className="z-[200]"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
            >
              <div className="flex items-center satoshi mb-2">
                <IoIosOptions />
                FILTER
              </div>
            </button>
          </div>

          {/* =====FILTER MENU =====*/}
          <div className="">
            <AnimatePresence mode="wait">
              {isFilterOpen && (
                <FilterMenu
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  onApply={handleApplyFilters}
                />
              )}
            </AnimatePresence>

            <motion.div
              variants={background}
              initial="initial"
              animate={isFilterOpen ? "open" : "closed"}
              className="bg-gray-800/40 w-full fixed right-0 inset-y-0 z-[90]"
              onClick={() => setIsFilterOpen(false)}
            ></motion.div>
          </div>

          <div
            id="shop-grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                productName={product.name}
                thumbnail={product.thumbnail}
                price={product.default_price}
                link={`/products/${product.slug}`}
              />
            ))}
          </div>
        </div>

        <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
          <Extras showSlider={false} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Shop;
