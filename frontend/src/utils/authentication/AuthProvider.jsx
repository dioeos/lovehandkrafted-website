import { useState, useEffect, createContext, useContext } from "react";    
import {jwtDecode} from 'jwt-decode';
import api from "../lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN } from "../../token";

import { LoginUtil } from "./LoginUtil";
import axios from "axios";
import { LogoutUtil } from "./LogoutUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
    }, []);


    // const refreshToken = async () => {
    //     try {
    //         await api.post('/authentication/dj-rest-auth/token/refresh/');
    //     } catch (error) {
    //         console.error('Error refreshing token', error);
    //         setIsAuthorized(false);
    //     }
    // };


    async function handleLogin(email, password) {
        try {
            await LoginUtil(email, password);
            setIsAuthorized(true); // user is now authenticated
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