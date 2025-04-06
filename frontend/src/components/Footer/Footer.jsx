import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";

import { motion } from "framer-motion";
import api from "../../utils/lib/api";
import PhilippinesClock from "./Clock";

const Footer = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handlesubmit = async (event) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        try {
            const response = await api.post("/newsletter/subscribe/", {
                email: email.trim()
            });
            console.log(response);

            if (response.status === 200) {
                console.log("Successfully subscribed");
            }
        } catch (error) {
            console.log("Error subscribing", error);
        }
    };

    return (
        <div id="footer-wrapper" className="bg-[#352f36] -mt-[5vh]">

            <div id="footer-container" className="ml-[2vw] z-100 p-4 flex flex-col justify-end bg-[#352f36]">

                <div id="header" className="relative mb-[10vh] flex flex-col">
                    <div className='md:w-[50%] m-0 text-[2rem] md:text-[5.3rem] leading-[30px] md:leading-[5.2rem] uppercase text-[#FAF9F6] satoshi'>
                        Subscribe to our newsletter
                    </div>
                    <div className='text-[#FAF9F6] m-0 uppercase relative'>
                        <div className="satoshi text-[1rem] leading-[40px] md:leading-[45px] md:text-[2.2rem]">
                            Join the family
                        </div>
                    </div>

                    <div className="">
                        <form onSubmit={handlesubmit} className=" relative flex items-center h-12 mt-2 manrope text-[0.7em] md:text-md w-[50%]">
                            <input
                                type="text"
                                id="newsletter-email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter an email address"
                                className="rounded-3xl w-full px-3 md:px-4 py-2 pr-10 text-[#FAF9F6] border border-[#FAF9F6] bg-transparent focus:outline-none focus:ring-0"
                            />

                            <button
                                onClick={handlesubmit}
                                type="submit"
                                className="absolute right-3 text-[#FAF9F6] cursor-pointer bg-transparent border-none"
                            >
                                &rarr;
                            </button>
                        </form>
                    </div>
                </div>


                <div id="extras" className="flex justify-between satoshi uppercase">

                    <div id="left-container" className="flex gap-10">
                        <div id="version-header" className="text-[#FAF9F6]">
                            <p className="opacity-50">Version</p>
                            <p>2025 &copy; Edition</p>
                        </div>

                        <div id="time-header" className="text-[#FAF9F6]">
                            <p className="opacity-50">Local Time</p>
                            <PhilippinesClock/>
                        </div>
                    </div>

                    <div id="right-container">
                        <div id="socials-header" className="">
                            <p className="text-[#FAF9F6] opacity-50">Socials</p>

                            <div id="icons-folder">
                                <div className="flex justify-center items-center gap-4 text-3xl mt-4 text-[#FAF9F6]">
                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <FaFacebook className="text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>


                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <FaTwitter className="text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>

                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <FaInstagram className="text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>
                                </div>


                            </div>
                        </div>
                    </div>


                </div>

            </div>


        </div>
        // <div className="bg-[#E2D8C9] py-6 px-6 sm:px-8 md:px-16 lg:px-30 flex flex-col items-center justify-center w-full">
        //     <div className="flex flex-col md:flex-row px-6 sm:px-10 pb-5 gap-6 md:gap-12 border-b-2 border-[#0B1215] border-opacity-60 w-full">
        //         <div className="flex flex-col w-full md:w-1/2">
        //             <span className="uppercase text-[#0B1215] font-semibold">Subscribe to newsletter</span>
        //             <form onSubmit={handlesubmit} className="relative flex items-center h-12 mt-2">
        //                 <input
        //                     type="text"
        //                     id="newsletter-email"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                     required
        //                     placeholder="Enter an email address"
        //                     className="w-full px-4 py-2 border-2 border-[#0B1215] border-opacity-60 outline-none bg-[#f4f0ea]"
        //                 />
        //                 <button type="submit" className="p-1 text-3xl flex items-center rounded absolute right-2 top-1 cursor-pointer">
        //                     <FaAngleRight />
        //                 </button>
        //             </form>
        //             <span className="text-xs text-[#0B1215] opacity-60 mt-2">*By filling out this form, you are signing up to receive our emails. We treat all data confidentially. See our privacy policy.</span>
        //         </div>
                
        //         <motion.div 
        //             className="flex flex-col uppercase w-full md:w-1/4"
        //         >
        //             <span className="font-semibold text-[#0B1215]">Need help?</span>
        //             <motion.div
        //                 onClick={() => navigate('/faq')} 
        //                 whileHover={{ scale: 1.1 }}    
        //                 className="uppercase bg-[#352f36] h-12 text-[#fffff0] font-extrabold mt-2 flex items-center justify-center cursor-pointer"
        //             >
        //                 SUPPORT
        //             </motion.div>
        //         </motion.div>
        //     </div>

        //     <div className="p-1 pb-5 border-b-2 border-[#0B1215] border-opacity-60 w-full">
        //         <div className="flex justify-center items-center gap-4 text-3xl mt-4">
        //             <a href="#" target="_blank" rel="noopener noreferrer">
        //                 <FaFacebook className="text-[#0B1215] opacity-60 hover:opacity-100" />
        //             </a>
        //             <a href="#" target="_blank" rel="noopener noreferrer">
        //                 <FaInstagram className="text-[#0B1215] opacity-60 hover:opacity-100" />
        //             </a>
        //         </div>
        //     </div>

        //     <div className="p-1 w-full text-center">
        //         <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-[#0B1215] opacity-60 uppercase mt-4">
        //             <a href="#" className="hover:underline">Terms</a>
        //             <a href="#" className="hover:underline">Privacy Policy</a>
        //             <a href="#" className="hover:underline">Identity</a>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Footer;
