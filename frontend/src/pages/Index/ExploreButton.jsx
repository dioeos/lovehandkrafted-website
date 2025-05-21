import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export const ExploreButton = ({buttonText}) => {
    return (
        <motion.a
            href="/shop"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}    
                className="text-[#352f36]"
            >
                <motion.div
                    initial={{ scale: 0}} 
                    animate={{ scale: 1}}
                    transition={{ 
                        ease: [0.6, 0.01, -0.05, 0.95],
                        duration: 1,
                        delay: 1.8
                    }}
                    className="h-[80px] w-[80px] md:h-[120px] md:w-[120px] rounded-full absolute flex justify-center items-center bg-[#352f36]"
                >
                    <motion.span
                        initial={{ opacity: 0}} 
                        animate={{ opacity: 1}}
                        transition={{
                            ease: "easeInOut",
                            duration: 1,
                            delay: 2.5,
                        }}

                        className="flex justify-center items-center gap-2"
                    >
                        <motion.div
                            transition={{duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                            className="flex justify-center items-center uppercase satoshi text-[0.7rem] md:text-[1rem]"
                        >
                            <p className="flex justify-center items-center gap-1 pt-2.5 text-[#fffff0]">{buttonText}<FaArrowRight/></p>
                        </motion.div>

                    </motion.span>

                </motion.div>
            </motion.div>
        </motion.a>
    )
}