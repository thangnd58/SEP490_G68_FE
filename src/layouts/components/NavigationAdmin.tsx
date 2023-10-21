import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { ManagementIcon } from '../../assets/icons';
import usei18next from '../../hooks/usei18next';
import { ROUTES } from '../../utils/Constant';
import { VerifiedUser } from '@mui/icons-material';

export default function NavigationAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = usei18next();

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
        }
    ];

    console.log(location)
    return (
        <React.Fragment>
            <Box role="presentation">
                <Box sx={{ display: 'flex', gap: '10px', my: 1, mx: 2 }}>
                    <ManagementIcon />
                    <Typography fontSize={18}>{t("dashBoardManager.Navigation.manager")}</Typography>
                </Box>
                <List>
                    <Divider />
                    {RouterManage.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton sx={{ backgroundColor: location.pathname.includes(item.path) ? "primary.main" : "common.white", color: location.pathname.includes(item.path) ? "common.white" : "primary.main" }} onClick={() => navigate(item.path)}>
                                <ListItemIcon>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </React.Fragment>
    );
}
