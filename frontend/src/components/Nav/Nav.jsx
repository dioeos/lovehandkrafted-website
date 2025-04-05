import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { opacity } from "./anim";
import { useLocation } from "react-router-dom";

import Menu from "./Menu";

const path01Variants = {
    open: { d: "M3.06061 2.99999L21.0606 21" },
    closed: { d: "M0 9.5L24 9.5" },
};

const path02Variants = {
    open: { d: "M3.00006 21.0607L21 3.06064" },
    moving: { d: "M0 14.5L24 14.5" },
    closed: { d: "M0 14.5L15 14.5" },
};


const Nav = () => {
    const location = useLocation();
    const showAnimation = location.pathname === "/";
    const [isActive, setIsActive] = useState(false);

    const path01Controls = useAnimation();
    const path02Controls = useAnimation();


    const onClick = async () => {
        setIsActive(!isActive);

        if (!isActive) {
            await path02Controls.start(path02Variants.moving);
            path01Controls.start(path01Variants.open);
            path02Controls.start(path02Variants.open);
        } else {
            path01Controls.start(path01Variants.closed);
            await path02Controls.start(path02Variants.moving);
            path02Controls.start(path02Variants.closed);
        }
    };

    return (
        <motion.div 
            id="header" 
            className="bg-[#f4f0ea] absolute top-0 left-0 w-full box-border p-2 text-[#0B1215] z-50"
            initial={showAnimation ? { opacity: 0, y: -50 } : false}
            animate={showAnimation ? { opacity: 1, y: 0} : false}
            transition={{
                ease: "easeInOut",
                duration: 1,
                delay: 1.8
            }}
        >
            <div id="bar" className="flex relative justify-center uppercase text-xs ">
                <a href="/" style={{color: "#0B1215", textDecoration: "none"}} className="absolute left-0 mt-1 text-xs md:text-lg">Lovehandkrafted</a>

                <div onClick={onClick} className="flex gap-[8px] cursor-pointer ">
                    
                    <button onClick={onClick} className=" border-none cursor-pointer flex justify-start items-start">
                        <svg width="24" height="24" viewBox="0 0 24 24" className=" flex justify-end items-end md:mt-1.5">
                            <motion.path
                                fill="none"
                                stroke="#0B1215"
                                strokeWidth="2"
                                animate={path01Controls}
                                initial={path01Variants.closed}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.path
                                fill="none"
                                stroke="#0B1215"
                                strokeWidth="2"
                                animate={path02Controls}
                                initial={path02Variants.closed}
                                transition={{ duration: 0.2 }}
                            />
                        </svg>
                    </button>

                    <div id="label" className="relative flex items-center justify-center mt-1">
                        <motion.p variants={opacity} animate={!isActive ? "open" : "closed"} className="text-xs md:text-lg">Menu</motion.p>
                        <motion.p variants={opacity} animate={isActive ? "open" : "closed"} className={`absolute text-xs md:text-lg ${isActive ? "block" : "hidden"}`}>Close</motion.p>
                    </div>
                </div>

                <motion.div variants={opacity} animate={!isActive ? "open" : "closed"} className="absolute flex gap-[30px] right-0 mt-1">
                    <p className="hidden md:block md:cursor-pointer md:text-lg">Shop</p>
                    <div className="flex gap-[6px] cursor-pointer">
                            <svg className="h-[20px] w-[20px] sm:h-[25px] sm:w-[25px] md:h-[30px] md:w-[30px]" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z" stroke="#4D3D30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <p className="md:text-lg text-xs">Cart(0)</p>
                    </div>
                </motion.div>
            </div>
                {/* <AnimatePresence mode="wait">
                    {isActive && (
                        <motion.div className="absolute top-full left-0 w-full">
                            <Menu />
                        </motion.div>

                    )}
                </AnimatePresence> */}
                <AnimatePresence mode="wait">
                    {isActive && (
                        <div className="">
                            <Menu />
                        </div>
                    )}
                </AnimatePresence>

        </motion.div>
    )
}

export default Nav;