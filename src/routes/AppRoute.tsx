import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/HomePage/HomePage";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Layout from "../layouts/Layout";

const AppRoute = () => {
    const { roleName } = useAuth();
    return (
        <Routes>
            {routes.map((route, index) => {
                const PageLayout = route.layout || Layout;

                const PageComponent = route.role ? (route.role.includes(roleName) ? route.component : Home) : route.component
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
