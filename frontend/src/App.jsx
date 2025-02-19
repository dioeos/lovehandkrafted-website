import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import AuthenticatedView from "./components/AuthenticatedView/AuthenticatedView";
import { getCSRF, getSession, whoami, login, logout } from "./utils/authentication/auth";
import Nav from "./components/Nav/Nav";

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

            <div className="">
              <Nav />
              {/* <div>
                <h1>React Cookie Auth</h1>
                {!this.state.isAuthenticated ? (
                    <LoginForm
                        username={this.state.username}
                        password={this.state.password}
                        error={this.state.error}
                        onLogin={this.handleLogin}
                        onUsernameChange={(e) => this.setState({ username: e.target.value })}
                        onPasswordChange={(e) => this.setState({ password: e.target.value })}
                    />
                ) : (
                    <AuthenticatedView whoami={whoami} logout={this.handleLogout} />
                )}
 
              </div> */}
            </div>
        );
    }
}

export default App;
