import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, hover } from "framer-motion";

//general components
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

//index sections
import { HeroSection } from "./HeroSection";
import { IntroSection } from "./IntroSection";
import { FeaturedSection } from "./FeaturedSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <Nav />
      <div id="index-root" className="flex-grow">
        <HeroSection />
        <IntroSection />
        <FeaturedSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
