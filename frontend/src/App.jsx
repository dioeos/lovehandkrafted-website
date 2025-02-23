import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import { useAuthentication } from "./utils/authentication/auth";

// Pages
import Index from "./pages/Index/Index";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Profile from "./pages/Index/Index";
//import AuthPage from "./pages/AuthPage";
//import RedirectGoogleAuth from "./components/GoogleRedirectHandler";

function App() {
    const { isAuthorized } = useAuthentication();

    const ProtectedLogin = () => (isAuthorized ? <Navigate to="/" /> : <Login initialMethod="login" />);
    const ProtectedRegister = () => (isAuthorized ? <Navigate to="/" /> : <Login initialMethod="register" />);

    return (
        <Router>
            <Nav />
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/profile" element={<Profile />} />


                {/* <Route path="/login/callback" element={<RedirectGoogleAuth />} /> */}
                <Route path="/login" element={<ProtectedLogin />} />
                <Route path="/register" element={<ProtectedRegister />} />
                <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes */}
            </Routes>
        </Router>
    );
}

export default App;
