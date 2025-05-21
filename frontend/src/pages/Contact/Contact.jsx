import Nav from "../../components/Nav/Nav";
import { Card } from "../../components/Card/Card";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";

const Contact = () => {
  const circleContainer = useRef(null);
  const { scrollYProgress } = useScroll({
    target: circleContainer,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div className="bg-[#352f36]">
      <Nav />
      <div id="contact-wrapper" className="min-h-screen bg-[#FAF9F6]">
        <div id="contact-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="contact-header">
            <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">
              CONTACT US
            </h1>
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

export default Contact;
