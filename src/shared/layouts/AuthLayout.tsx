import { Outlet } from "react-router";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
export default AuthLayout;
