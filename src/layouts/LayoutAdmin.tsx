import React, { useState } from 'react'
import { AppBar, Avatar, Box, Card, CardContent, CardHeader, Divider, Drawer, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import Header from './components/Header';
import NavigationAdmin from './components/NavigationAdmin';
import theme from '../utils/theme';
import { useAppSelector } from '../hooks/useAction';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/Constant';
import usei18next from '../hooks/usei18next';
import useThemePage from '../hooks/useThemePage';
import { Close, Menu } from '@mui/icons-material';
import MyIcon from '../components/common/MyIcon';

export interface LayoutAdminProps {
    children: JSX.Element;
}

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
    const { user } = useAppSelector((state) => state.userInfo);
    const navigate = useNavigate();
    const { t } = usei18next();
    const { isMobile, isIpad } = useThemePage();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    return (
        <Box display="flex" flexDirection="column">
            {/* Header */}
            <Box position="sticky" top={"0"} zIndex={1000} width={"100%"} sx={{ backgroundColor: "#fff" }}>
                <Header />
            </Box>

            {/* Background Part */}
            <Box position="sticky" top={"85px"} height={"107px"} zIndex={998} width={"100%"} sx={{ backgroundColor: "#8B4513" }} />

            {/* Main Part */}
            <Box component="main" display="flex">
                {isIpad || isMobile ?
                    (
                        <Box component="aside" height={"580px"} position="sticky" top={"85px"} style={{ zIndex: 999 }} sx={{ marginTop: '-107px' }} >
                            <Menu
                                sx={{
                                    color: theme.palette.common.white,
                                    cursor: "pointer",
                                    padding: "32px 8px",
                                }}
                                onClick={toggleDrawer}
                            />
                        </Box>
                    ) :
                    (
                        <Box component="aside" width={"25%"} height={"580px"} position="sticky" top={"85px"} style={{ zIndex: 999 }} sx={{ marginTop: '-107px', mb: "24px" }} >
                            <Box sx={{ backgroundColor: "#8B4513" }} display={'flex'} justifyContent={'start'} alignItems={'center'} padding={"16px"} gap={"8px"}>
                                <Avatar onClick={() => navigate(ROUTES.user.userprofile)} sx={{ width: 75, height: 75 }} src={user?.avatarUrl} alt={user?.name} />
                                <Box display={'flex'} justifyContent={'center'} alignItems={'start'} flexDirection={"column"} gap={"2px"}>
                                    <Typography variant='h1' fontSize={"18px"} sx={{ fontWeight: "600" }} color={theme.palette.common.white}>{user?.name}</Typography>
                                    <Typography variant='h1' fontSize={"12px"} sx={{ fontWeight: "400", fontStyle: "italic" }} color={theme.palette.common.white}>{user?.email}</Typography>
                                    <Typography variant='h1' fontSize={"10px"} sx={{ fontWeight: "400", mt: "4px" }} color={theme.palette.common.white}>{user?.role.roleName === 'Admin' ? t("layout.admin") : t("layout.staff")}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ border: "1px solid #E0E0E0", margin: "16px", borderRadius: '4px' }}>
                                <NavigationAdmin />
                            </Box>
                        </Box>
                    )}
                {/* Content */}
                <Box component="section" width={isIpad || isMobile ? "100%" : "85%"} p={"32px 32px 32px 0px"} style={{ overflow: 'auto', zIndex: 999, marginTop: '-107px' }} >
                    {children}
                </Box>
            </Box>
            <Drawer
                sx={{ "& .MuiDrawer-paper": { width: isMobile ? "70%" : "30%", boxSizing: "border-box", marginTop: "85px" } }}
                className='drawerAdmin'
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
            >
                <Box
                    style={{ width: "100%", height: "100%" }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <Box sx={{ backgroundColor: "#8B4513" }} display={'flex'} justifyContent={'start'} alignItems={'center'} padding={"16px"} gap={"8px"}>
                        <Avatar onClick={() => navigate(ROUTES.user.userprofile)} sx={{ width: 75, height: 75 }} src={user?.avatarUrl} alt={user?.name} />
                        <Box display={'flex'} justifyContent={'center'} alignItems={'start'} flexDirection={"column"} gap={"2px"}>
                            <Typography variant='h1' fontSize={"18px"} sx={{ fontWeight: "600" }} color={theme.palette.common.white}>{user?.name}</Typography>
                            <Typography variant='h1' fontSize={"12px"} sx={{ fontWeight: "400", fontStyle: "italic" }} color={theme.palette.common.white}>{user?.email}</Typography>
                            <Typography variant='h1' fontSize={"10px"} sx={{ fontWeight: "400", mt: "4px" }} color={theme.palette.common.white}>{user?.role.roleName === 'Admin' ? t("layout.admin") : t("layout.staff")}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ border: "1px solid #E0E0E0", margin: "16px", borderRadius: '4px' }}>
                        <NavigationAdmin />
                    </Box>

                </Box>
            </Drawer>
        </Box >
    )
}

export default LayoutAdmin;