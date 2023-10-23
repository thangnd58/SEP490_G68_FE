import React from 'react'
import { AppBar, Avatar, Box, Card, CardContent, CardHeader, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import Header from './components/Header';
import NavigationAdmin from './components/NavigationAdmin';
import theme from '../utils/theme';
import { useAppSelector } from '../hooks/useAction';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/Constant';
import usei18next from '../hooks/usei18next';

export interface LayoutAdminProps {
    children: JSX.Element;
}

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
    const { user } = useAppSelector((state) => state.userInfo);
    const navigate = useNavigate();
    const {t} = usei18next();
    return (
        <Box display="flex" flexDirection="column">
            {/* Header */}
            <Box position="sticky" top={"0"} zIndex={1000} width={"100%"} sx={{ backgroundColor: "#fff" }}>
                <Header />
            </Box>

            {/* Background Part */}
            <Box position="sticky" top={"85px"} height={"107px"} zIndex={998} width={"100%"} sx={{ backgroundColor: "#8B4513" }} />

            {/* Main Part */}
            <Box component="main" display="flex" >
                {/* Side bar */}
                <Box component="aside" width={"20%"} height={"580px"} position="sticky" top={"85px"} style={{ zIndex: 999 }} sx={{ marginTop: '-107px', mb: "24px" }} >
                    <Box sx={{ backgroundColor: "#8B4513" }} display={'flex'} justifyContent={'start'} alignItems={'center'} padding={"16px"} gap={"8px"}>
                        <Avatar onClick={() => navigate(ROUTES.user.userprofile)} sx={{ width: 75, height: 75 }} src={user?.avatarUrl} alt={user?.name} />
                        <Box display={'flex'} justifyContent={'center'} alignItems={'start'} flexDirection={"column"} gap={"2px"}>
                            <Typography variant='h1' fontSize={"18px"} sx={{ fontWeight: "600" }} color={theme.palette.common.white}>{user?.name}</Typography>
                            <Typography variant='h1' fontSize={"12px"} sx={{ fontWeight: "400", fontStyle: "italic" }} color={theme.palette.common.white}>{user?.email}</Typography>
                            <Typography variant='h1' fontSize={"10px"} sx={{ fontWeight: "400", mt: "4px" }} color={theme.palette.common.white}>{user?.role.roleName === 'Admin' ? t("layout.admin") : t("layout.staff")}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ border: "1px solid #E0E0E0", margin:"16px", borderRadius: '4px' }}>
                        <NavigationAdmin />
                    </Box>
                </Box>

                {/* Content */}
                <Box component="section" width={"80%"} p={"24px 32px 32px 0px"} style={{ overflow: 'auto', zIndex: 999, marginTop: '-107px' }} >
                    {children}
                    {children}
                    {children}
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default LayoutAdmin;