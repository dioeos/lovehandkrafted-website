import Footer from "../../components/Footer/Footer";
import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";

const message1 = "Our pieces are more than just crafts; they are stories that inspire."

const About = () => {

    return (
        <div>
            <Nav/>

            <div id="about-wrapper" className="min-h-screen bg-[#FAF9F6]">

                <div id="about-container" className="mt-[4em] mx-[2vw] p-4">

                    <div id="about-header">
                        <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">About</h1>
                    </div>


                </div>

                <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
                    <Extras showSlider={false}/>
                </div>

                <Footer/>

            </div>
        </div>


    )

}

export default About;