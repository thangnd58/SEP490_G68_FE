import { Verified, VerifiedOutlined, VerifiedUser } from "@mui/icons-material";
import { ROUTES } from "../utils/Constant";

export const RouterManage = [
    {
        path: ROUTES.admin.managemotorbikes,
        name: "Quản lí xe cho thuê",
        icon: VerifiedUser,
    },
    {
        path: ROUTES.admin.managelicences,
        name: "Quản lí bằng lái xe",
        icon: VerifiedUser,
    }
];
