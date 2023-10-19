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
// import { MyMapArea } from '../components/common/MyMapArea';
import MyMapArea from '../components/common/MyMapArea';
import ListMotorbike from '../pages/PostMotorbike/ListMotorbike';
import MotorbikeManagement from '../pages/DashBoardPage/MotorbikeManagement/MotorbikeManagement';
import LayoutAdmin from '../layouts/LayoutAdmin';
import LicenceManagement from '../pages/DashBoardPage/LicenceManagement/LicenceManagement';
import LicenceRegisterDetail from '../pages/DashBoardPage/LicenceManagement/LicenceRegisterDetail';
import MotorbikeRegisterDetail from '../pages/DashBoardPage/MotorbikeManagement/MotorbikeRegisterDetail';



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
    { path: ROUTES.user.registermotorbike, component: RegisterMotorbike, role: ["Admin","Customer"]},
    { path: ROUTES.user.listmotorbike, component: ListMotorbike, role: ["Customer"]},
    { path: ROUTES.user.registermotorbike, component: RegisterMotorbike, role: ["Admin", "Customer"]},
    { path: ROUTES.account.login, component: Login, layout: LayoutWithoutFooter, role: ["Guest"]},
    { path: ROUTES.account.register, component: Register, layout: LayoutWithoutFooter, role: ["Guest"] },
    { path: ROUTES.account.resetpassword, component: ResetPassword, layout: LayoutWithoutFooter, role: ["Guest"]},
    { path: `${ROUTES.account.verifyrequired}/:type`, component: VerifyRequired, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.userverification}/:ticket`, component: VerifyReigsterStatus, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.setpassword}/:ticket`, component: SetNewPassword, layout: LayoutWithoutFooter },
    { path: `${ROUTES.admin.managemotorbikes}`, component: MotorbikeManagement, layout: LayoutAdmin, role: ["Admin"] },
    { path: `${ROUTES.admin.managelicences}`, component: LicenceManagement, layout: LayoutAdmin, role: ["Admin"] },
    { path: `${ROUTES.admin.licenceRegister}/:id`, component: LicenceRegisterDetail, layout: LayoutAdmin, role: ["Admin"] },
    { path: `${ROUTES.admin.MotorbikeRegister}/:id`, component: MotorbikeRegisterDetail, layout: LayoutAdmin, role: ["Admin"] },
];