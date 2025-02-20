import { useState } from "react";
import { motion } from 'framer-motion';
import { height } from "./anim";
import Body from "./Body";

import Footer from "./Footer";

const links = [
    {
        title: "Home",
        href: "/",
        src: "home.png"
    }, 

    {
        title: "Shop",
        href: "/",
        src: "home.png"
    }, 

    {
        title: "About",
        href: "/",
        src: "home.png"
    }, 

    {
        title: "Contact",
        href: "/",
        src: "home.png"
    }, 

    {
        title: "Login",
        href: "/",
        src: "home.png"
    }, 

    {
        title: "FAQ",
        href: "/",
        src: "home.png"
    }, 

]

const Menu = () => {

    const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});

    return (
        <div className="">
            <motion.div variants={height} initial="initial" animate="enter" exit="exit" className="">
                <div id="wrapper" className="overflow-hidden flex gap-[50px] mb-[80px] lg:mb-[0px] lg:justify-between">
                    <div id="container" className="flex flex-col justify-between w-full">
                        <Body links={links} selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
                        <Footer />

                    </div>

                </div>

            </motion.div>
        </div>
    )

}

export default Menu;