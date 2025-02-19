import React from "react";

const LoginForm = ({ username, password, error, onLogin, onUsernameChange, onPasswordChange }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className=""
                        id="username"
                        name="username"
                        value={username}
                        onChange={onUsernameChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className=""
                        id="password"
                        name="password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                    {error && <small className="text-danger">{error}</small>}
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
