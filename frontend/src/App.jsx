import React from "react";
import { getCSRF, getSession, whoami, login, logout } from "./utils/authentication/auth";
import Nav from "./components/Nav/Nav";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import Index from "./pages/Index/Index";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Faq from "./pages/Faq/Faq";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csrf: "",
            username: "",
            password: "",
            error: "",
            isAuthenticated: false,
        };
    }

    componentDidMount = async () => {
        const sessionData = await getSession();
        if (sessionData.isAuthenticated) {
            this.setState({ isAuthenticated: true });
        } else {
            this.setState({ isAuthenticated: false });
            const csrfToken = await getCSRF();
            this.setState({ csrf: csrfToken });
        }
    };

    handleLogin = async (username, password) => {
        try {
            await login(username, password, this.state.csrf);
            this.setState({ isAuthenticated: true, username: "", password: "", error: "" });
        } catch (error) {
            this.setState({ error: "Wrong username or password." });
        }
    };

    handleLogout = async () => {
        try {
            await logout();
            const csrfToken = await getCSRF();
            this.setState({ isAuthenticated: false, csrf: csrfToken });
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <Router>
                <Nav />
                    <Routes>
                        <Route path="/" element={<Index/>} />
                        <Route path="/about" element={<About/>} />
                        <Route path="/shop" element={<Shop/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/faq" element={<Faq/>} />
                        <Route path="/contact" element={<Contact/>} />

                    </Routes>
            </Router>

        );
    }
}

export default App;
