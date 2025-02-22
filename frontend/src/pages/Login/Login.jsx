import LoginForm from "../../components/LoginForm/LoginForm";


const Login = ({ username, password, error, onLogin, onUsernameChange, onPasswordChange }) => {
    console.log("Login")
    return (
        <div id="login-root" className="h-screen bg-blue-500 p-10">
            <LoginForm/>

        </div>

    )

}

export default Login;



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