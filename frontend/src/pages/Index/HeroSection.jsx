import { motion, useScroll, useTransform } from 'framer-motion';
import { MainTitle } from "./MainTitle"
import { useRef } from 'react';
import { ExploreButton } from './ExploreButton';


export const HeroSection = () => {


    const heroContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroContainer,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0,1], [0, -350])
    const y2 = useTransform(scrollYProgress, [0,1], [0, -300])

    const phrase = "We create with a Heart.";
    return (

        <section id="hero-section" className='p-4 min-h-screen'>
            <div ref={heroContainer} id='body' className='ml-[2vw] mt-[40vh]'>

                <div className="relative">
                    <motion.div style={{ y, initial: "0px"  }} className='m-0 mt-[20px] text-[2rem] md:text-[5.3rem] leading-[30px] md:leading-[4rem] uppercase text-[#352f36]'>
                        <MainTitle title={"LOVEHANDKRAFTED"}/>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50}} 
                    animate={{ opacity: 1, y: 0}}
                    transition={{
                        ease: "easeInOut",
                        duration: 1,
                        delay: 1.2
                    }}
                    className=""
                >
                    <div className='text-[#352f36] m-0 uppercase relative'>
                        <motion.div style={{ y: y2, initial: "0px" }} className="satoshi text-[1rem] leading-[2px] md:leading-[45px] md:text-[2.2rem]">
                            {phrase}
                        </motion.div>
                    </div>


                </motion.div>

                <motion.div 
                    style={{y: y2, initial: "0px"}} 
                    className='inline-block cursor-pointer'
                >
                    <ExploreButton />
                </motion.div>


            </div>
        </section>
    )
}
                