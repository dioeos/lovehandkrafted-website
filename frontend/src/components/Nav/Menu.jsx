import { useState } from "react";
import { motion } from 'framer-motion';
import { height } from "./anim";
import Body from "./Body";

import Footer from "./Footer";

import { useAuthentication } from "../../utils/authentication/auth";


const Menu = () => {

    const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});
    const { isAuthorized } = useAuthentication();

    const links = [
        {
            title: "Home",
            href: "/",
            src: "home.png"
        }, 

        {
            title: "Shop",
            href: "/shop",
            src: "home.png"
        }, 

        {
            title: "About",
            href: "/about",
            src: "home.png"
        }, 

        {
            title: "Contact",
            href: "/",
            src: "home.png"
        }, 

        {
            title: "FAQ",
            href: "/faq",
            src: "home.png"
        },

        isAuthorized
            ? { title: "Profile", href: "/profile"}
            : { title: "Login", href: "/login"},
    ]

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