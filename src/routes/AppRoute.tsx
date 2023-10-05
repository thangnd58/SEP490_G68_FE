import { Route, Routes } from "react-router-dom";
import Login from '../pages/AccountPage/Login';
import Register from '../pages/AccountPage/Register';
import { ROUTES } from '../utils/Constant';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
import VerifyRegister from "../pages/AccountPage/VerifyRegister";
import ResetPassword from "../pages/AccountPage/ResetPassword";
import VerifyStatus from "../pages/AccountPage/VerifyStatus";


const AppRoute = () => {
    return (
        <Routes>
            <Route path={ROUTES.user.userprofile} element={<UserProfilePage />} />
            <Route path={ROUTES.account.login} element={<Login />} />
            <Route path={ROUTES.account.register} element={<Register />} />
            <Route path={ROUTES.account.resetpassword} element={<ResetPassword />} />
            <Route path={ROUTES.account.verifyrequired} element={<VerifyRegister />} />
            <Route path={`${ROUTES.account.userverification}/:ticket`} element={<VerifyStatus/>} />
        </Routes>
    )
}

export default AppRoute