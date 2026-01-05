import { Outlet } from "react-router";
import { Footer } from "../components/footer";
import { Header } from "../components/header"

const ClientLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default ClientLayout;
