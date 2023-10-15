import { Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../layouts/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ROUTES } from "../utils/Constant";
import { Home } from "@mui/icons-material";

const AppRoute = () => {
    const { user, getUser } = useAuth();
    const [roleName, setRoleName] = useState<string>("Guest");
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
        if (user && user.role) {
            setRoleName(user.role.roleName);
        }
    }, [user]);

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
