import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import usei18next from '../../hooks/usei18next';
import { ROUTES } from '../../utils/Constant';
import { VerifiedUser } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector } from '../../hooks/useAction';

export default function NavigationAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = usei18next();
    const { user } = useAppSelector((state) => state.userInfo);

    const RouterManage = [
        {
            path: ROUTES.admin.dashboard,
            name: t("dashBoardManager.Navigation.dashboard"),
            role: "Admin",
        },
        {
            path: ROUTES.admin.managemotorbikes,
            name: t("dashBoardManager.Navigation.motorbikeRentalManager"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managelicences,
            name: t("dashBoardManager.Navigation.licenseManager"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managerequestwithdraw,
            name: t("dashBoardManager.Navigation.withdrawalRequestManager"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managerBrand,
            name: t("dashBoardManager.Navigation.brand"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managerModel,
            name: t("dashBoardManager.Navigation.model"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.manageNews,
            name: t("dashBoardManager.Navigation.news"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managePromotion,
            name: t("dashBoardManager.Navigation.promotions"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.manageReport,
            name: t("dashBoardManager.Navigation.report"),
            role: "Admin,Staff",
        },
        {
            path: ROUTES.admin.managerUser,
            name: t("dashBoardManager.Navigation.user"),
            role: "Admin",
        },
        {
            path: ROUTES.admin.managerFeedback,
            name: t("dashBoardManager.Navigation.feedback"),
            role: "Admin,Staff",
        }
        ,
        {
            path: ROUTES.admin.managerBooking,
            name: t("dashBoardManager.Navigation.booking"),
            role: "Admin,Staff",
        }
    ];

    return (
        <Box
            // className="hiddenSroll"
            role="presentation" sx={{
                maxHeight: "60vh",
                overflowY: "auto",
            }}>
            {/* <Box sx={{ display: 'flex', gap: '10px', my: 1, mx: 2 }}>
                    <ManagementIcon />
                    <Typography fontSize={18}>{t("dashBoardManager.Navigation.manager")}</Typography>
                </Box> */}
            <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                {RouterManage.filter((r) => r.role && r.role.includes(user!.role.roleName)).map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton sx={{ border: "1px solid #E0E0E0", backgroundColor: location.pathname.includes(item.path) ? "primary.main" : "common.white", color: location.pathname.includes(item.path) ? "common.white" : "primary.main" }} onClick={() => navigate(item.path)}>
                            {/* <IconButton>
                                <item.icon />
                            </IconButton> */}
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
