import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/authentication/AuthProvider";

import AuthForm from "../../components/LoginForm/LoginForm";



const Login = ({ initialMethod }) => {
    const [method, setMethod] = useState(initialMethod);

    const { isAuthorized } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthorized) {
            navigate("/profile");
        }
    }, [isAuthorized, navigate])





    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    const route = method === 'login' ?  '/authentication/dj-rest-auth/login/': '/authentication/dj-rest-auth/registration/';

    return (
        <div>
            <AuthForm route={route} method={method} />
        </div>
    )
}
export default Login;