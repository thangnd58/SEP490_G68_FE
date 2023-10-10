import { Route, Routes } from "react-router-dom";
import Login from '../pages/AccountPage/Login';
import Register from '../pages/AccountPage/Register';
import { ROUTES } from '../utils/Constant';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
import VerifyRequired from "../pages/AccountPage/VerifyRequired";
import ResetPassword from "../pages/AccountPage/ResetPassword";
import VerifyReigsterStatus from "../pages/AccountPage/VerifyReigsterStatus";
import SetNewPassword from "../pages/AccountPage/SetNewPassword";


const AppRoute = () => {
    return (
        <Routes>
            <Route path={ROUTES.user.userprofile} element={<UserProfilePage />} />
            <Route path={ROUTES.account.login} element={<Login />} />
            <Route path={ROUTES.account.register} element={<Register />} />
            <Route path={ROUTES.account.resetpassword} element={<ResetPassword />} />
            <Route path={`${ROUTES.account.verifyrequired}/:type`} element={<VerifyRequired/>} />
            <Route path={`${ROUTES.account.userverification}/:ticket`} element={<VerifyReigsterStatus/>} />
            <Route path={`${ROUTES.account.setpassword}/:ticket`} element={<SetNewPassword/>} />
        </Routes>
    )
}

export default AppRoute