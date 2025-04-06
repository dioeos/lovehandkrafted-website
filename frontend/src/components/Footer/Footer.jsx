import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleRight, FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";

import { motion } from "framer-motion";
import api from "../../utils/lib/api";
import PhilippinesClock from "./Clock";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [header, setHeader] = useState("Subscribe to our newsletter")
    const [phrase, setPhrase] = useState("Join the family");


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

            if (response.status === 201) {
                setHeader("Thanks for joining")
                setPhrase("Welcome to the family!");
            }
        } catch (error) {
            console.log("Error subscribing", error);
        }
    };

    return (
        <div id="footer-wrapper" className="bg-[#352f36] -mt-[5vh]">

            <div id="footer-container" className="-mt-[5vh] ml-[2vw] z-100 p-4 flex flex-col justify-end bg-[#352f36]">

                <div id="header" className="relative mb-[10vh] flex flex-col">
                    <div
                        className={`md:w-[55%] m-0 text-[2rem] md:text-[5.3rem] leading-[30px] md:leading-[5.2rem] uppercase text-[#FAF9F6] satoshi ${
                            header === "Thanks for joining" ? "md:w-[60%]" : ""
                        }`}
                    >
                        {header}
                    </div>
                    <div className='text-[#FAF9F6] m-0 uppercase relative'>
                        <div className="mt-[0.2rem] mb-[0.5rem] md:mt-[0.4em] md:mb-[.7em] satoshi text-[1rem] leading-[40px] md:leading-[45px] md:text-[2.2rem]">
                            {phrase}
                        </div>
                    </div>
                    <div className="">
                        <form onSubmit={handlesubmit} className=" relative flex items-center h-12 mt-2 manrope text-[0.7em] md:text-[1em] w-[50%]">
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
                                type="submit"
                                className="absolute right-3 text-[#FAF9F6] cursor-pointer bg-transparent border-none"
                            >
                                <FaArrowCircleRight/>
                            </button>
                        </form>
                    </div>
                </div>
               


                <div id="extras" className="flex justify-between satoshi uppercase text-[.7rem] md:text-[1rem]">

                    <div id="left-container" className="flex gap-10">
                        <div id="version-header" className="text-[#FAF9F6]">
                            <p className="opacity-50">Version</p>
                            <p className="text-[.7rem] md:text-[1rem]">2025 &copy; Edition</p>
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
                                        <FaFacebook className="text-[1.2rem] md:text-[2rem] text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>


                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <FaTwitter className="text-[1.2rem] md:text-[2rem] text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>

                                    <a href="#" target="_blank" rel="noopener noreferrer">
                                        <FaInstagram className="text-[1.2rem] md:text-[2rem] text-[#FAF9F6] opacity-60 hover:opacity-100" />
                                    </a>
                                </div>


                            </div>
                        </div>
                    </div>


                </div>

            </div>


        </div>
    );
};

export default Footer;
