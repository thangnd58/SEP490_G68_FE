import { Route, Routes, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../layouts/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import Home from "../pages/HomePage/HomePage";

const AppRoute = () => {
    const { roleName } = useAuth();
    return (
        <Routes>
            {routes.map((route, index) => {
                const PageLayout = route.layout || Layout;
                // const PageComponent = route.role ? (route.role.includes(roleName) ? route.component : Home) : route.component
                const PageComponent = route.component
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
