import React from "react";

const AuthenticatedView = ({ whoami, logout }) => {
    return (
        <div>
            <p>You are logged in!</p>
            <button className="btn btn-primary mr-2" onClick={whoami}>WhoAmI</button>
            <button className="btn btn-danger" onClick={logout}>Log out</button>
        </div>
    );
};

export default AuthenticatedView;
