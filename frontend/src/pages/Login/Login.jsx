import { useState, useEffect } from "react";
import AuthForm from "../../components/LoginForm/LoginForm";


const Login = ({ initialMethod }) => {
    const [method, setMethod] = useState(initialMethod)


    useEffect(() => {
        setMethod(initialMethod);
    }, [initialMethod]);

    const route = method === 'login' ?  '/authentication/token/': '/authentication/user/register/';

    return (
        <div>
            <AuthForm route={route} method={method} />
        </div>
    )
}
export default Login;