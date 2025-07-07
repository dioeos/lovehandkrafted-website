import { useState, useEffect, createContext, useContext } from "react";
import api from "../lib/api";

//import { LoginUtil } from "./LoginUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isLoading, setIsLoading] = useState(true); //to prevent flickering & decisions before authentication data loaded
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleRefreshToken = async () => {
    try {
      await api.post("/authentication/token/refresh/");
    } catch (error) {
      setIsAuthorized(false);
      setIsVendor(false);
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/authentication/user");
      console.log(response.data);

      if (response && response.data.email) {
        setIsAuthorized(true);
        setUserEmail(response.data.email);
        setUserFirstName(response.data.first_name);
        setUserLastName(response.data.last_name);

        if (response.data.is_vendor === true) {
          setIsVendor(true);
        } else {
          setIsVendor(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        await handleRefreshToken();
        await checkAuth();
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  async function handleLogin(email, password) {
    try {
      setIsLoading(true);
      const response = await api.post("/authentication/login/", {
        email,
        password,
      });

      if (response.status === 200) {
        await checkAuth();
        return; //successful login
      }
    } catch (error) {
      setIsAuthorized(false);
      throw error; //let handleSubmit in loginform handle errors
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoading(true);
      const response = await api.post("/authentication/logout");

      if (response.status === 200) {
        setIsAuthorized(false);
        setIsVendor(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      setIsAuthorized(false);
      setIsVendor(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        handleLogin,
        handleLogout,
        isVendor,
        isLoading,
        userFirstName,
        userLastName,
        userEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
