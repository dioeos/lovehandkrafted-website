import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card } from "../../components/Card/Card";
import { Extras } from "./Extras";

export const FeaturedSection = () => {
  const featuredContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: featuredContainer,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section id="featured-section" className="bg-[#FAF9F6]">
      <div ref={featuredContainer} className="bg-[#FAF9F6]">
        <motion.div
          id="header"
          style={{ y, initial: "0px" }}
          className="p-2 md:p-4 ml-[2vw] mb-0 bg-[#FAF9F6]"
        >
          <h1 className="satoshi text-[1.5rem] md:text-[2rem] uppercase leading-[1.3]">
            Product Showcase
          </h1>
        </motion.div>
      </div>

      <div
        id="carousel-wrapper"
        className="overflow-x-hidden overflow-y-hidden bg-[#352f36] -mt-[1px]"
      >
        <Extras showSlider={true} />
      </div>
    </section>
  );
};
