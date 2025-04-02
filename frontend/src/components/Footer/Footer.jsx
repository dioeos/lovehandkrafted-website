import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleRight, FaFacebook, FaInstagram } from "react-icons/fa";
import api from "../../utils/lib/api";

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
        <div className="bg-[#E2D8C9] py-6 px-6 sm:px-8 md:px-16 lg:px-30 flex flex-col items-center justify-center w-full">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row px-6 sm:px-10 pb-5 gap-6 md:gap-12 border-b-2 border-[#0B1215] border-opacity-60 w-full">
                {/* Newsletter Section */}
                <div className="flex flex-col w-full md:w-1/2">
                    <span className="uppercase text-[#0B1215] font-semibold">Subscribe to newsletter</span>
                    <form onSubmit={handlesubmit} className="relative flex items-center h-12 mt-2">
                        <input
                            type="text"
                            id="newsletter-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter an email address"
                            className="w-full px-4 py-2 border-2 border-[#0B1215] border-opacity-60 outline-none bg-[#f4f0ea]"
                        />
                        <button type="submit" className="p-1 text-3xl flex items-center rounded absolute right-2 top-1 cursor-pointer">
                            <FaAngleRight />
                        </button>
                    </form>
                    <span className="text-xs text-[#0B1215] opacity-60 mt-2">*By filling out this form, you are signing up to receive our emails. We treat all data confidentially. See our privacy policy.</span>
                </div>
                
                {/* Support Button */}
                <div className="flex flex-col uppercase w-full md:w-1/4">
                    <span className="font-semibold text-[#0B1215]">Need help?</span>
                    <button
                        onClick={() => navigate('/faq')} 
                        className="uppercase bg-[#0B1215] opacity-80 hover:opacity-100 h-12 text-[#f4f0ea] font-extrabold mt-2 flex items-center justify-center"
                    >
                        SUPPORT
                    </button>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="p-1 pb-5 border-b-2 border-[#0B1215] border-opacity-60 w-full">
                <div className="flex justify-center items-center gap-4 text-3xl mt-4">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-[#0B1215] opacity-60 hover:opacity-100" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-[#0B1215] opacity-60 hover:opacity-100" />
                    </a>
                </div>
            </div>

            {/* Footer Links */}
            <div className="p-1 w-full text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-[#0B1215] opacity-60 uppercase mt-4">
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Identity</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
