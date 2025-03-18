import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
    return (
        <div className="h-screen">
            <Nav />
            <div className="">
                {children}
            </div>
            <Footer/>
        </div>
    );
};

export default Layout;
