import { useState, useEffect, createContext, useContext } from "react";    
import api from "../lib/api";

//import { LoginUtil } from "./LoginUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

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
                setIsAuthorized(true)
                
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
        }

    }

    useEffect(() => {
        const initAuth = async () => {
            try {
                await handleRefreshToken();
                await checkAuth();
            } catch (error) {
                setIsAuthorized(false)
            }
        }
        initAuth();
    }, []);


    async function handleLogin(email, password) {
        try {
            const response = await api.post("/authentication/dj-rest-auth/login/", {email, password});

            if (response.status === 200) {
                await checkAuth();
                return; //successful login
            } 
        } catch (error) {
            setIsAuthorized(false);
            throw error; //let handleSubmit in loginform handle errors
        }
    }

    async function handleLogout() {
        try {
            const response = await api.post("/authentication/dj-rest-auth/logout")

            if (response.status === 200) {
                setIsAuthorized(false)
            } else {
                setIsAuthorized(true)
            }
        } catch (error) {
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