import Nav from "../../components/Nav/Nav";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";

const About = () => {
  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div className="">
      <Nav />

      <div id="contact-wrapper" className="h-screen bg-[#FAF9F6]">
        <div id="contact-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="reset-content" className="w-full mx-auto p-4 mt-8">
            <div className="text-center satoshi">
              <h1 className="uppercase !text-[2.5rem] md:!text-[6rem] text-[#352f36] satoshi">
                About Us
              </h1>

              <div
                className="
                  max-w-md
                  w-full
                  mx-auto
                  text-sm sm:text-base
                  text-[#352f36]
                  satoshi
                  mb-5
                "
              >
                <p>
                  Rooted in sustainbility and Filipino craftmanship,
                  Lovehandkrafted Shop celebrates the beauty of locally sourced,
                  natural materials. Since 2013, we've been handcrafting a
                  diverse range of products from Christmans ornaments, home
                  décor, and bags. Each item is designed to bring warmth, color,
                  and authenticity into your home.
                </p>
                <br />
                <p>
                  Every piece is lovingly made by hand, showcasing our
                  commitment to quality, creativity, and cultural heritage.
                </p>
              </div>

              <div
                className="
                  max-w-md
                  w-full
                  mx-auto
                  text-sm sm:text-base
                  text-[#352f36]
                  satoshi
                  flex
                  items-center
                  justify-center
                "
              ></div>
            </div>

            <div></div>
          </div>
        </div>
      </div>

      <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
        <Extras showSlider={false} />
      </div>

      <Footer />
    </div>
  );
};

export default About;
