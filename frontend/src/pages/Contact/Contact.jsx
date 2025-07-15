import Nav from "../../components/Nav/Nav";
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
    <div className="">
      <Nav />

      <div id="contact-wrapper" className="h-screen bg-[#FAF9F6]">
        <div id="contact-container" className="mt-[4em] mx-[2vw] p-4">
          <div id="reset-content" className="w-full mx-auto p-4 mt-8">
            <div className="text-center satoshi">
              <h1 className="uppercase !text-[2.5rem] md:!text-[6rem] text-[#352f36] satoshi">
                Contact Us
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
                Thank you for exploring the Lovehandkrafted Store! Please
                contact us for any questions, collaboration ideas, or custom
                requests. We are always happy to connect and create something
                special with you.
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
              >
                <a
                  href="mailto:lovehandkrafted@gmail.com"
                  className="border-1 rounded-lg border-[#352f36] p-1 inline-block"
                  style={{ textDecoration: "none", color: "#352f36" }}
                >
                  lovehandkrafted@gmail.com
                </a>
              </div>
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

export default Contact;
