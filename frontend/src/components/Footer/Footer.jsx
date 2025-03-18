import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    const [email, setEmail] = useState("")
    const navigate = useNavigate();

    return (
        <div className="bg-[#E2D8C9] py-8 px-30 flex flex-col items-center justify-center w-full">

            <div className="flex px-30 pb-5 gap-50 border-b-2 border-[#0B1215] border-opacity-60 w-full">
                <div className="flex flex-col w-1/2">
                    <span className="uppercase text-[#0B1215] font-semibold">Suscribe to newsletter</span>
                    <form className="relative flex items-center h-12">
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter an email address"
                            className="w-full px-4 py-2 border-2 border-[#0b1215] border-opacity-60 outline-none bg-[#f4f0ea]"
                        />

                        <span className="p-1 text-3xl flex gap-0.5 items-center rounded absolute right-1 top-1 cursor-pointer">
                            <FaAngleRight />
                        </span>
                    </form>

                    <span className="text-xs text-[#0B1215] opacity-60">*by filling out this form, you are signing up to receive our emails, we treat all data confidentially, see our privacy policy</span>


                </div>

                <div className="flex flex-col uppercase w-1/4">
                    <span className="font-semibold text-[#0B1215]">Need help?</span>
                    <button
                        onClick={() => navigate('/faq')} 
                        className="uppercase bg-[#0B1215] opacity-60 h-12 text-[#f4f0ea] items-center justify-between font-extrabold"
                    >
                        SUPPORT

                    </button>


                </div>
            </div>

            <div className="p-1 pb-5 border-b-2 border-[#0B1215] border-opacity-60 w-full">

                <div className="flex justify-center items-center gap-2 text-3xl">
                    <a
                        href="#" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <FaFacebook className="text-[#0B1215] opacity-60"/>
                    </a>

                    <a
                        href="#" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <FaInstagram className="text-[#0B1215] opacity-60"/>
                    </a>
                </div>

            </div>

            <div className="p-1 w-full">

                <div className="flex justify-center items-center gap-2 text-[#0B1215] opacity-60 uppercase no-underline">
                    <div className="flex gap-3 no-underline">
                        <a
                            href="#" 
                            className=""
                            style={{textDecoration: `none`}}
                        >
                            <span className="text-[#0B1215] opacity-60">Terms</span>
                        </a>

                        <a
                            href="#"
                            style={{textDecoration: `none`}}
                        >
                            <span className="text-[#0B1215] opacity-60">Privacy Policy</span>
                        </a>


                        <a
                            href="#" 
                            className="no-underline decoration-none"
                            style={{textDecoration: `none`}}
                        >
                            <span className="text-[#0B1215] opacity-60">Identity</span>
                        </a>
                    </div>
                </div>

            </div>

        </div>

    )

}
export default Footer;