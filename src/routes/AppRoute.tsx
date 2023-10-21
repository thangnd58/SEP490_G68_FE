import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/HomePage/HomePage";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Layout from "../layouts/Layout";
import PageNotFound from "../pages/OrtherPage/PageNotFound";
import LayoutEmpty from "../layouts/LayoutEmpty";
import Login from "../pages/AccountPage/Login";
import LayoutWithoutFooter from "../layouts/LayoutWithoutFooter";

const AppRoute = () => {
    const { roleName } = useAuth();
    return (
        <Routes>
            {routes.map((route, index) => {  
                let PageComponent = route.component;
                let PageLayout = route.layout || Layout;

                

                // check role
                if (roleName === "Guest") {
                    PageComponent = route.role === undefined ? route.component : Login; 
                }else{
                    PageComponent = route.role ? (route.role.includes(roleName) ? route.component : PageNotFound) : route.component
                }
                // check layout
                if (PageComponent === PageNotFound) {
                    PageLayout = LayoutEmpty;
                }
                if (PageComponent === Login) {
                    PageLayout = LayoutWithoutFooter;
                }

                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <PageLayout>
                                <PageComponent />
                            </PageLayout>
                        }
                    />
                );
            })}
        </Routes>
    );
};

export default AppRoute;
