import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Card } from "../../components/Card/Card";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import { Extras } from "../Index/Extras";

const Shop = () => {

    const circleContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: circleContainer,
        offset: ["start end", "end start"]
    })


    const height = useTransform(scrollYProgress, [0, 0.9], [50, 0])

    
    return (
        <div className="bg-[#352f36]">
            <Nav/>
            <div id="shop-wrapper" className="min-h-screen bg-[#FAF9F6]">

                <div id="shop-container" className="mt-[4em] mx-[2vw] p-4">
                    <div id="shop-header">
                        <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">ALL</h1>
                    </div>

                    <div id="filter-system-container">
                    </div>

                    <div id="shop-grid" className="grid grid-cols-2 md:grid-cols-4">

                        <Card productName="Item 1"/>
                        <Card productName="Item 2"/>
                        <Card productName="Item 3"/>
                        <Card productName="Item 4"/>

                        <Card productName="Item 1"/>
                        <Card productName="Item 2"/>
                        <Card productName="Item 3"/>
                        <Card productName="Item 4"/>


                        <Card productName="Item 1"/>
                        <Card productName="Item 2"/>
                        <Card productName="Item 3"/>
                        <Card productName="Item 4"/>

                    </div>
                </div>


                <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
                    <Extras showSlider={false}/>
                </div>



                <Footer/>

            </div>
        </div>
    )

}

export default Shop;