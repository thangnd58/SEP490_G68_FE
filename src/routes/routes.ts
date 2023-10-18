import Login from '../pages/AccountPage/Login';
import Register from '../pages/AccountPage/Register';
import { ROUTES } from '../utils/Constant';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
import VerifyRequired from "../pages/AccountPage/VerifyRequired";
import ResetPassword from "../pages/AccountPage/ResetPassword";
import VerifyReigsterStatus from "../pages/AccountPage/VerifyReigsterStatus";
import SetNewPassword from "../pages/AccountPage/SetNewPassword";

export type UserRole = 'Admin' | 'Customer' | 'Cuest';

import LayoutWithoutFooter from '../layouts/LayoutWithoutFooter';
import Home from '../pages/HomePage/HomePage';
import RegisterMotorbike from '../pages/PostMotorbike/RegisterMotorbike';
import MyMapArea from '../components/common/MyMapArea';

export type Route = {
    path: string;
    component: React.FC;
    layout?: any;
    role?: string[];
}

export const routes: Route[] = [
    { path: ROUTES.homepage, component: Home },
    { path: ROUTES.component.mymaparea, component: MyMapArea},
    { path: ROUTES.user.userprofile, component: UserProfilePage, role: ["Admin", "Customer"] },
    { path: ROUTES.user.registermotorbike, component: RegisterMotorbike, role: ["Customer"]},
    { path: ROUTES.account.login, component: Login, layout: LayoutWithoutFooter, role: ["Guest"]},
    { path: ROUTES.account.register, component: Register, layout: LayoutWithoutFooter, role: ["Guest"] },
    { path: ROUTES.account.resetpassword, component: ResetPassword, layout: LayoutWithoutFooter, role: ["Guest"]},
    { path: `${ROUTES.account.verifyrequired}/:type`, component: VerifyRequired, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.userverification}/:ticket`, component: VerifyReigsterStatus, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.setpassword}/:ticket`, component: SetNewPassword, layout: LayoutWithoutFooter },
];