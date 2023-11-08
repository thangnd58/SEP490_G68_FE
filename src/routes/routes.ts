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
import UpdateRegisterMotorbike from '../pages/PostMotorbike/UpdateRegisterMotorbike';
import MyMapWithSearchBox from '../components/common/MyMapWithSearchBox';
import PageNotFound from '../pages/OrtherPage/PageNotFound';
import LayoutEmpty from '../layouts/LayoutEmpty';
import IntroductionMotorbike from '../pages/PostMotorbike/IntroductionMotorbike';
import Wallet from '../pages/WalletPage/WalletPage';
import WithdrawalRequestManagement from '../pages/DashBoardPage/WithdrawalRequestManagement/WithdrawalRequestManagement';
import Favourite from '../pages/FavouritePage/FavouritePage';
import ListMotorbikesSearchedPage from '../pages/HomePage/ListMotorbikesSearchedPage';
import BrandManagement from '../pages/DashBoardPage/BrandManagement/BrandManagement';
import CartPage from '../pages/CartPage/CartPage';

export type Route = {
    path: string;
    component: React.FC;
    layout?: any;
    role?: string[];
}

export const routes: Route[] = [
    // Home Page
    { path: ROUTES.homepage, component: Home },
    { path: `${ROUTES.search.filtermotorbike}/:startDate/:endDate/:address`, component: ListMotorbikesSearchedPage },

    // Components Page
    { path: ROUTES.component.mymaparea, component: MyMapArea },
    { path: ROUTES.component.mymapwithsearch, component: MyMapWithSearchBox },
    { path: ROUTES.other.pagenotfound, component: PageNotFound, layout: LayoutEmpty },

    // User Page
    { path: ROUTES.user.userprofile, component: UserProfilePage, role: ["Admin", "Staff", "Customer"] },
    { path: ROUTES.user.registermotorbike, component: RegisterMotorbike, role: ["Customer"] },
    { path: ROUTES.user.introductionmotorbike, component: IntroductionMotorbike },
    { path: ROUTES.user.listmotorbike, component: ListMotorbike, role: ["Customer"] },
    { path: ROUTES.user.shoppingCart, component: CartPage, role: ["Customer"] },
    { path: `${ROUTES.user.updateregistermotorbike}/:id`, component: UpdateRegisterMotorbike, role: ["Customer"] },
    { path: ROUTES.user.favourite, component: Favourite, role: ["Customer"] },

    // Auth Page
    { path: ROUTES.account.login, component: Login, layout: LayoutWithoutFooter },
    { path: ROUTES.account.register, component: Register, layout: LayoutWithoutFooter },
    { path: ROUTES.account.resetpassword, component: ResetPassword, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.setpassword}/:ticket`, component: SetNewPassword, layout: LayoutWithoutFooter },

    // Verify Page
    { path: `${ROUTES.account.verifyrequired}/:type`, component: VerifyRequired, layout: LayoutWithoutFooter },
    { path: `${ROUTES.account.userverification}/:ticket`, component: VerifyReigsterStatus, layout: LayoutWithoutFooter },

    // Admin Page
    { path: `${ROUTES.admin.managemotorbikes}`, component: MotorbikeManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerequestwithdraw}`, component: WithdrawalRequestManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managelicences}`, component: LicenceManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerBrand}`, component: BrandManagement, layout: LayoutAdmin, role: ["Admin"] },
    { path: `${ROUTES.admin.licenceregister}/:id`, component: LicenceRegisterDetail, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.motorbikeregister}/:id`, component: MotorbikeRegisterDetail, layout: LayoutAdmin, role: ["Admin", "Staff"] },

    //Wallet Page
    { path: `${ROUTES.user.wallet}`, component: Wallet, role: ["Admin", "Staff", "Customer"] },
];