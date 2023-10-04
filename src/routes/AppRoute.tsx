import { Route, Routes } from "react-router-dom";
import Login from '../pages/AccountPage/Login';
import Register from '../pages/AccountPage/Register';
import { ROUTES } from '../utils/Constant';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';


const AppRoute = () => {
    return (
        <Routes>
            <Route path={ROUTES.user.userprofile} element={<UserProfilePage />} />
            <Route path={ROUTES.account.login} element={<Login />} />
            <Route path={ROUTES.account.register} element={<Register />} />
        </Routes>
    )
}

export default AppRoute