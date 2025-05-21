import { useEffect } from "react";
import { useAuth } from "../../utils/authentication/AuthProvider";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";

import { IoPerson } from "react-icons/io5";
import Footer from "../../components/Footer/Footer";

const Profile = () => {

    const { isAuthorized, handleLogout, userLastName, userFirstName} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthorized) {
            navigate("/account/login");
        }
    }, [isAuthorized, navigate]);


    return (
        <div>
            <Nav/>
            <div id="profile-wrapper" className="bg-[#FAF9F6]">

                <div id="profile-container" className="min-h-screen mt-[4em] mx-[2vw] grid grid-rows-[200px_1fr_150px] p-4 bg-[#FAF9F6]">
                    <div id="grid-item-1">
                        <div id="profile-header">
                            <h1 className="uppercase !text-[4rem] md:!text-[6rem] text-[#352f36] satoshi">Profile</h1>

                            <button
                                onClick={handleLogout} 
                                className="text-[#352f36] flex justify-center items-center self-start gap-2"
                            >
                                <IoPerson/>Logout

                            </button>
                        </div>
                    </div>

                    <div id="grid-item-2">
                        <div id="orders-container" className=" flex flex-col">
                            <h2>Orders</h2>
                            <div>Order 1</div>
                            <div>Order 1</div>
                            <div>Order 1</div>
                            <div>Order 1</div>
                        </div>
                    </div>

                    <div id="grid-item-3">
                        <h2>Account Details</h2>
                        <div className="flex flex-col">
                            <p className="">{userFirstName}</p>
                            <p className="">{userLastName}</p>
                        </div>
                    </div>

                </div>
                
                <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
                    <Extras showSlider={false}/>
                </div>

                <Footer/>

            </div>
        </div>
        // <Layout>
        //     <div id="index-root" className="h-screen grid grid-rows-[200px_2fr_1fr] p-4">

        //         <div id="grid-item-1" className="flex flex-col justify-center p-4">
        //             <div className="mt-5">
        //                 <h1>Account</h1>
        //                 <button 
        //                     onClick={handleLogout} // 
        //                     className="text-black rounded-md shadow-md transition flex justify-center items-center self-start gap-2"
        //                 >
        //                     <IoPerson/> Logout

        //                 </button>
        //             </div>
        //         </div>

        //         <div id="grid-item-2" className="p-4 flex flex-col">
        //             <div>
        //                 <h2>Orders</h2>
        //                 <div>Order 1</div>
        //                 <div>Order 1</div>
        //                 <div>Order 1</div>
        //                 <div>Order 1</div>
        //             </div>
        //         </div>


        //         <div id="grid-item-3" className="p-4 flex flex-col">
        //             <div>
        //                 <h2>Account Details</h2>
        //                 <div className="flex flex-col">
        //                     <p className="">{userFirstName}</p>
        //                     <p className="">{userLastName}</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </Layout>
    )

}

export default Profile;