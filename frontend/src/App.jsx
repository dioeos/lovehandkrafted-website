import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav/Nav";

import { AuthProvider } from "./utils/authentication/AuthProvider"; // global authentication context

// Pages
import Index from "./pages/Index/Index";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
//import AuthPage from "./pages/AuthPage";
//import RedirectGoogleAuth from "./components/GoogleRedirectHandler";

function App() {

    return (
        <AuthProvider>
            <Router>
                <Nav />
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login initialMethod="login" />} />
                    <Route path="/register" element={<Login initialMethod="register" />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </Router>

        </AuthProvider>
    )
}

export default App;
