import { Route as Router, Routes } from "react-router-dom";
// import Login from '../pages/AccountPage/Login';
// import Register from '../pages/AccountPage/Register';
// import { ROUTES } from '../utils/Constant';
// import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
// import VerifyRequired from "../pages/AccountPage/VerifyRequired";
// import ResetPassword from "../pages/AccountPage/ResetPassword";
// import VerifyReigsterStatus from "../pages/AccountPage/VerifyReigsterStatus";
// import SetNewPassword from "../pages/AccountPage/SetNewPassword";

import LayoutWithoutFooter from '../layouts/LayoutWithoutFooter';
import { Route, routes } from "./routes";
import Layout from "../layouts/Layout";


const AppRoute = () => {
    // const {isLogined, } = useAuth();

    return (
        <Routes>
            {
                routes.map((route: Route, index: number) => {
                    const PageLayout = route.layout || Layout;

                    const PageComponent = route.component;
                    return <Router key={index} path={route.path} element={
                        <PageLayout>
                            <PageComponent />
                        </PageLayout>
                    } />
                })
            }

        </Routes>
    )
}

export default AppRoute