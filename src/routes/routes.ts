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
import Wallet from '../pages/WalletPage/WalletPage';
import WithdrawalRequestManagement from '../pages/DashBoardPage/WithdrawalRequestManagement/WithdrawalRequestManagement';
import Favourite from '../pages/FavouritePage/FavouritePage';
import ListMotorbikesSearchedPage from '../pages/HomePage/ListMotorbikesSearchedPage';
import BrandManagement from '../pages/DashBoardPage/BrandManagement/BrandManagement';
import CartPage from '../pages/CartPage/CartPage';
import NewsManagement from '../pages/DashBoardPage/NewsManagement/NewsManagement';
import NewsManagementForm from '../pages/DashBoardPage/NewsManagement/NewsManagementForm';
import { DetailNews } from '../pages/NewsPage/DetailNews';
import { NewsPage } from '../pages/NewsPage/NewsPage';
import MotorbikeDetailPage from '../pages/MotorbikePage/MotorbikeDetailPage';
import MyBooking from '../pages/BookMotorbike/MyBooking';
import { BookingDetailPage } from '../pages/MotorbikePage/BookingDetailPage';
import BrandManagementForm from '../pages/DashBoardPage/BrandManagement/BrandManagementForm';
import PromotionManagement from '../pages/DashBoardPage/PromotionManagement/PromotionManagement';
import PromotionManagementForm from '../pages/DashBoardPage/PromotionManagement/PromotionManagementForm';
import ModelManagement from '../pages/DashBoardPage/ModelManagement/ModelManagement';
import ModelManagementForm from '../pages/DashBoardPage/ModelManagement/ModelManagementForm';
import { PromotionPage } from '../pages/PromotionPage/PromotionPage';
import SearchingHotProvince from '../pages/HomePage/SearchingHotProvince';
import SearchingHotPlace from '../pages/HomePage/SearchingHotPlace';
import PreviewBecomeAnOwner from '../pages/PostMotorbike/PreviewBecomeAnOwner';
import ReportManagement from '../pages/DashBoardPage/ReportManagement/ReportManagement';
import ReportManagementForm from '../pages/DashBoardPage/ReportManagement/ReportManagementForm';
import { BookingDetailPageOwner } from '../pages/MotorbikePage/BookingDetailPageOwner';
import UserManagement from '../pages/DashBoardPage/UserManagement/UserManagement';
import UserManagementForm from '../pages/DashBoardPage/UserManagement/UserManagementForm';

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
    { path: `${ROUTES.search.searchprovince}/:province/`, component: SearchingHotProvince },
    { path: `${ROUTES.search.searchplace}/:place/`, component: SearchingHotPlace },
    { path: `${ROUTES.newspage}`, component: NewsPage },
    { path: `${ROUTES.promotionpage}`, component: PromotionPage },
    { path: `${ROUTES.newspage}/:id`, component: DetailNews },

    // Components Page
    { path: ROUTES.component.mymaparea, component: MyMapArea },
    { path: ROUTES.component.mymapwithsearch, component: MyMapWithSearchBox },
    { path: ROUTES.other.pagenotfound, component: PageNotFound, layout: LayoutEmpty },

    // User Page
    { path: ROUTES.user.userprofile, component: UserProfilePage, role: ["Admin", "Staff", "Customer"] },
    { path: ROUTES.user.registermotorbike, component: RegisterMotorbike, role: ["Customer"] },
    { path: ROUTES.user.previewbecomeanowner, component: PreviewBecomeAnOwner},
    { path: ROUTES.user.listmotorbike, component: ListMotorbike, role: ["Customer"] },
    { path: ROUTES.user.shoppingCart, component: CartPage, role: ["Customer"] },
    { path: `${ROUTES.user.updateregistermotorbike}/:id`, component: UpdateRegisterMotorbike, role: ["Customer"] },
    { path: ROUTES.user.favourite, component: Favourite, role: ["Customer"] },
    { path: `${ROUTES.user.detailmotorbike}/:motorbikeId/:searchedAddress/:startDate/:endDate`, component: MotorbikeDetailPage },
    { path: `${ROUTES.booking.detail}/:bookingId`, component: BookingDetailPage, role: ["Customer"] },
    { path: `${ROUTES.booking.detail_owner}/:bookingId`, component: BookingDetailPageOwner, role: ["Customer"] },

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
    { path: `${ROUTES.admin.managerBrand}`, component: BrandManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerBrand}/:id`, component: BrandManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerModel}`, component: ModelManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerModel}/:id`, component: ModelManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.manageNews}`, component: NewsManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.licenceregister}/:id`, component: LicenceRegisterDetail, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.motorbikeregister}/:id`, component: MotorbikeRegisterDetail, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.manageNews}/:id`, component: NewsManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managePromotion}`, component: PromotionManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managePromotion}/:id`, component: PromotionManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.manageReport}`, component: ReportManagement, layout: LayoutAdmin, role: ["Admin", "Staff"]},
    { path: `${ROUTES.admin.manageReport}/:id`, component: ReportManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"]},
    { path: `${ROUTES.admin.managerUser}`, component: UserManagement, layout: LayoutAdmin, role: ["Admin", "Staff"] },
    { path: `${ROUTES.admin.managerUser}/:id`, component: UserManagementForm, layout: LayoutAdmin, role: ["Admin", "Staff"] },

    //Wallet Page
    { path: `${ROUTES.user.wallet}`, component: Wallet, role: ["Admin", "Staff", "Customer"] },

    //Booking Page
    { path: ROUTES.booking.mybooking, component: MyBooking, role: ["Customer"] },
];