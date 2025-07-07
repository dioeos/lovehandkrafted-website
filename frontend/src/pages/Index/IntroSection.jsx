import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const IntroSection = () => {
  const introContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: introContainer,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  return (
    <section id="intro-section" className="h-[50vh] bg-[#FAF9F6] mt-[11rem]">
      <div
        ref={introContainer}
        className="p-4 grid grid-rows-[auto_auto_auto] md:grid-cols-[1fr_2fr]"
      >
        <motion.div
          id="image-container"
          className="bg-gray-500 hidden md:flex justify-center items-center"
          style={{ y, initial: "0px" }}
        >
          <img
            src="/your-image.jpg"
            alt="Handcrafted Gifts"
            className="w-full max-w-xs md:max-w-sm"
          />
        </motion.div>

        <div id="text-container" className="flex flex-col gap-4 md:p-4">
          <motion.div
            id="intro-text-container"
            className="satoshi text-[1.5rem] md:text-[2rem] uppercase leading-[1.3]"
            style={{ y, initial: "0px" }}
          >
            Welcome to the Lovehandkrafted Shop, where we believe gifts should
            be made by
            <span className="ml-4 mr-2 satoshi-italic">hand</span> and with{" "}
            <span className="ml-2 satoshi-italic">heart</span>.
          </motion.div>

          <div
            id="sub-text-container"
            className="manrope flex flex-col text-[.9rem]"
          >
            <div id="sub-text-sm" className="flex gap-2">
              <motion.div style={{ y, initial: "0px" }} className="">
                <p className="text-[1em] md:text-[1.5rem] md:w-2/3">
                  Every item in our collection celebrates the uniqueness of
                  handcrafted products.
                </p>
              </motion.div>
              <a
                className="flex no-underline md:absolute md:ml-[35rem]"
                href="/about"
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  className="flex no-underline"
                  style={{ y: y2, initial: "0px" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-[80px] w-[80px] md:h-[120px] md:w-[120px] rounded-full bg-[#352f36] text-[#fffff0] flex justify-center items-center"
                  >
                    <button className="flex justify-center items-center p-2 uppercase satoshi">
                      <span className="uppercase text-[.7rem] md:text-[1rem]">
                        About Us
                      </span>
                    </button>
                  </motion.div>
                </motion.div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
