import Nav from "../Nav/Nav";

const Layout = ({ children }) => {
    return (
        <div className="h-screen">
            <Nav />
            <div className="">
                {children}
            </div>
        </div>
    );
};

export default Layout;
