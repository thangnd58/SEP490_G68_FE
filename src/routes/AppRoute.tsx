import { Route, Routes, useLocation } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../layouts/Layout";
import PageNotFound from "../pages/OrtherPage/PageNotFound";
import LayoutEmpty from "../layouts/LayoutEmpty";
import Login from "../pages/AccountPage/Login";
import LayoutWithoutFooter from "../layouts/LayoutWithoutFooter";
import { useAppSelector } from "../hooks/useAction";
import { useEffect } from "react";

const AppRoute = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, [location.pathname])
    return (
        <Routes>
            {routes.map((route, index) => {
                let PageComponent = route.component;
                let PageLayout = route.layout || Layout;
                // check role
                if (user === null) {
                    PageComponent = route.role === undefined ? route.component : Login;
                } else {
                    PageComponent = route.role ? (user && user.role && route.role.includes(user.role.roleName) ? route.component : PageNotFound) : route.component
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
