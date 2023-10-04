import { Route, Routes } from "react-router-dom";
import Login from '../pages/AccountPage/Login';
import Register from '../pages/AccountPage/Register';
import { ROUTES } from '../utils/Constant';

const AppRoute = () => {
    return (
        <Routes>
            <Route path={ROUTES.account.login} element={<Login />} />
            <Route path={ROUTES.account.register} element={<Register />} />
        </Routes>
    )
}

export default AppRoute