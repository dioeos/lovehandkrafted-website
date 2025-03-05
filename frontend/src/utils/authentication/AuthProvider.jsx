import { useState, useEffect, createContext, useContext } from "react";    
import api from "../lib/api";

import { LoginUtil } from "./LoginUtil";
import { LogoutUtil } from "./LogoutUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    // const refreshToken = async () => {
    //     try {
    //         await api.post('/authentication/dj-rest-auth/token/refresh/');
    //     } catch (error) {
    //         console.error('Error refreshing token', error);
    //         setIsAuthorized(false);
    //     }
    // };
    const handleRefreshToken = async () => {
        try {
            await api.post("/authentication/dj-rest-auth/token/refresh/");
        } catch (error) {
            setIsAuthorized(false)
        }
    }

    const checkAuth = async () => {
        try {
            const response = await api.get("/authentication/dj-rest-auth/user");

            if (response && response.data.email) {

                console.log(response.data.email)
                console.log("user is authenticated")
                setIsAuthorized(true)
                
            } else {
                console.log("User is not authenticated")
                setIsAuthorized(false)
            }
        } catch (error) {
            //invalid token or not logged in
            console.log("Not logged in")
            setIsAuthorized(false)
        }

    }

    //! INSTEAD CHECK AUTH WITH REFRESH TOKENS
    useEffect(() => {
        console.log("Checking auth on load")
        const initAuth = async () => {
            try {
                await handleRefreshToken();
                await checkAuth();
            } catch (error) {
                console.error("Error during authentication process")
            }
        }
        initAuth();
    }, []);


    async function handleLogin(email, password) {
        try {
            const response = await LoginUtil(email, password);
            console.log(response)

            if (response) {
                console.log("Checking auth")
                await checkAuth();
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Login failed")
            setIsAuthorized(false);
        }
    }

    async function handleLogout() {
        try {
            await LogoutUtil();
            setIsAuthorized(false);
        } catch (error) {
            console.error("Logout failed")
            setIsAuthorized(true)
        }
    }


    return (
        <AuthContext.Provider value={{ isAuthorized, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);