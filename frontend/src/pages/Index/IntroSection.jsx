import { motion } from "framer-motion";

export const IntroSection = () => {
    return (
        <section id="intro-section" className="p-4 grid grid-rows-[auto_auto_auto] md:grid-cols-[1fr_2fr]">
                    
            <div id="image-container" className="hidden md:flex bg-gray-300 justify-center items-center">
                <img src="/your-image.jpg" alt="Handcrafted Gifts" className="w-full max-w-xs md:max-w-sm" />
            </div>

            <div id="text-container" className="flex flex-col gap-4 p-4">
                
                <div id="intro-text-container" className="manrope text-xl uppercase text-[1.5rem]">
                    Welcome to the Lovehandkrafted Shop, where we believe gifts should be made by hand and with heart.
                </div>

                <div id="sub-text-container" className="manrope flex flex-col text-[.9rem]">

                    <div id="sub-text-sm" className="flex gap-2">
                        <div>
                            <p>Every item in our collection celebrates the uniqueness of handcrafted products.</p>
                        </div>
                        <div className="flex justify-end items-end">

                            <div className="flex">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}    
                                    className="h-[60px] w-[60px] md:h-[120px] md:w-[120px] rounded-full bg-black text-white flex justify-center items-center"
                                >
                                    <button className="flex justify-center items-center p-2 uppercase manrope">
                                        <span className="uppercase text-[.7rem]">About Us</span>
                                    </button>
                                </motion.div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </section>
    )
}