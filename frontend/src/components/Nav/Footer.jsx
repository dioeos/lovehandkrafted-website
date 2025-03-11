import { translate } from "./anim";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <div id="footer" className="flex items-start flex-wrap uppercase mt-[20px] font-[12px]">
            <ul className="list-none w-1/4 mt-[5px] overflow-hidden">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    <span className="text-[#9f9689]">Made by: </span>Lovehandkrafted
                </motion.li>
            </ul>

            <ul className="list-none w-1/4 mt-[5px] overflow-hidden">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    <span className="text-[#9f9689]">Made by: </span>Ryan Dioneda
                </motion.li>
            </ul>

            
            <ul className="list-none w-1/4 mt-[5px] overflow-hidden">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    <span className="text-[#9f9689]">Made by: </span>Ryan Dioneda
                </motion.li>
            </ul>

            <ul className="list-none w-1/4 mt-[5px] overflow-hidden">
                <motion.li
                    custom={[0.3, 0]} 
                    variants={translate}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    <span className="text-[#9f9689]">Made by: </span>Ryan Dioneda
                </motion.li>

                {/* <motion.li
                    custom={[0.3, 0]} 
                    variants={translate}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    <span className="text-[#9f9689]">Made by: </span>Ryan Dioneda
                </motion.li> */}
            </ul>

        </div>
    )

}
export default Footer;