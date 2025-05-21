import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/authentication/AuthProvider";

import AuthForm from "../../components/LoginForm/LoginForm";
import Layout from "../../components/Layout/Layout";
import Nav from "../../components/Nav/Nav";
import { Extras } from "../Index/Extras";
import Footer from "../../components/Footer/Footer";



const Login = ({ initialMethod }) => {
    const [method, setMethod] = useState(initialMethod);

    const { isAuthorized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorized) {
            navigate("/account/profile");
        }
    }, [isAuthorized, navigate])





    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    const route = method === 'login' ?  '/authentication/dj-rest-auth/login/': '/authentication/dj-rest-auth/registration/';

    return (
        <div>
            <Nav/>
            <div id="auth-wrapper" className="bg-#[FAF9F6]">

                <div id="auth-container">
                    <AuthForm route={route} method={method} />
                </div>

                <div className="overflow-x-hidden overflow-y-hidden bg-[#352f36]">
                    <Extras showSlider={false}/>
                </div>

                <Footer/>
            </div>
        </div>
    )
}
export default Login;