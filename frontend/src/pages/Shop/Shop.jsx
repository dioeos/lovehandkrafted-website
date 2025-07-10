import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Card } from "../../components/Card/Card";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";
import api from "../../utils/lib/api";
import { IoIosOptions } from "react-icons/io";

const Shop = () => {
  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        console.log(response);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#352f36]">
      <Nav />
      <div id="shop-wrapper" className="min-h-screen bg-[#FAF9F6]">
        <div id="shop-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="shop-header">
            <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">
              ALL
            </h1>
          </div>

          <div
            id="filter-system-container"
            className="flex items-center satoshi mb-2"
          >
            <IoIosOptions />
            FILTER
          </div>

          <div
            id="shop-grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product) => (
              <Card
                key={product.id}
                productName={product.name}
                thumbnail={product.thumbnail}
                price={product.default_price}
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
