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

export default function NavigationAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = usei18next();
    const { logout } = useAuth();

    const RouterManage = [
        {
            path: ROUTES.admin.managemotorbikes,
            name: t("dashBoardManager.Navigation.motorbikeRentalManager"),
            icon: VerifiedUser,
        },
        {
            path: ROUTES.admin.managelicences,
            name: t("dashBoardManager.Navigation.licenseManager"),
            icon: VerifiedUser,
        },
        {
            path: ROUTES.admin.managerequestwithdraw,
            name: t("dashBoardManager.Navigation.withdrawalRequestManager"),
            icon: VerifiedUser,
        },
        {
            path: ROUTES.admin.managerBrand,
            name: t("dashBoardManager.Navigation.brand"),
            icon: VerifiedUser,
        }
    ];

    return (
        <Box role="presentation">
            {/* <Box sx={{ display: 'flex', gap: '10px', my: 1, mx: 2 }}>
                    <ManagementIcon />
                    <Typography fontSize={18}>{t("dashBoardManager.Navigation.manager")}</Typography>
                </Box> */}
            <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                {RouterManage.map((item, index) => (
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
