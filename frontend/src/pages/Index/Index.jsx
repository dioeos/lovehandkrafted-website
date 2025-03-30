import { useRef, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaArrowRight } from "react-icons/fa";
import { motion, useScroll, useTransform, hover } from 'framer-motion';

const Index = () => {

    const heroContainer = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroContainer,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0,1], [0, -200])
    const y2 = useTransform(scrollYProgress, [0,1], [0, -170])
    const y3 = useTransform(scrollYProgress, [0,1], [0, -170])

    const phrase = "We create with a Heart.";


    return (
        <Layout>
            <div id="index-root" className="mt-[20vh] h-screen grid">
                <section className=''>
                    <div ref={heroContainer} id='body' className='ml-[2vw] mt-[20vh] place-self-start'>

                        <div className="relative">
                            <motion.div style={{ y, initial: "0px" }} className='m-0 mt-[20px] text-[5vw] leading-[5vw] uppercase'>
                                LOVEHANDKRAFTED
                            </motion.div>
                        </div>

                        <div>
                            <p className='text-black m-0 mt-[10px] text-[2.5vw] uppercase relative'>
                                <motion.div style={{ y: y2, initial: "0px" }}>
                                    {phrase}
                                </motion.div>
                            </p>


                        </div>

                        <motion.div style={{y: y2, initial: "0px"}} className='p-2 border-2 rounded-4xl inline-block bg-red-500'>
                            <motion.div
                                className='cursor-pointer flex justify-center items-center gap-2'
                                whileHover={{scale: 1.1}}
                                transition={{duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                            
                            >
                                Explore <FaArrowRight/>

                            </motion.div>
                        </motion.div>


                    </div>
                </section>

                <section className='bg-green-500 p-2'>

                </section>
            </div>
        </Layout>
    )
}

export default Index;
