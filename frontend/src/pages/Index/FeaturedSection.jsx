import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from 'react'
import { Card } from "../../components/Card/Card";
import { Carousel } from "./Carousel";

export const FeaturedSection = () => {

    const featuredContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: featuredContainer,
        offset: ['start end', 'end start']
    })

    const y = useTransform(scrollYProgress, [0,1], [0, -10])

    return (

        <section id="featured-section" className="h-screen">

            <motion.div id="header" style={{ y, initial: "0px"}} className="p-2 md:p-4 ml-[2vw]">
                <h1 className="satoshi text-[1.5rem] md:text-[2rem] uppercase leading-[1.3]">Featured Products</h1>
            </motion.div>

            <div ref={featuredContainer} className="bg-[#352f36]">

                <div id="carousel-wrapper" className="overflow-x-hidden z-50">
                    <Carousel />
                </div>

            </div>

        </section>


    )
}