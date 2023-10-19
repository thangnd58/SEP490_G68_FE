import React, { memo, useState } from 'react';
import { AppBar, Avatar, Badge, Box, Button, Divider, Drawer, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, OutlinedInput, Popover, Typography, } from '@mui/material';
import UserService from '../../services/UserService';
import { AuthContext, useAuth } from '../../contexts/AuthContext';
import usei18next from '../../hooks/usei18next';
import { useNavigate } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';
import useThemePage from '../../hooks/useThemePage';
import { Notifications, Search } from '@mui/icons-material';
import { LogoHeader, NotificationIcon, UnitedKingDomFlag, VietNamFlag } from '../../assets/images';
import { ROUTES } from '../../utils/Constant';

const LanguageBox = memo(() => {
    const { isVn, changeLang } = usei18next();

    return (
        <img
            alt='language'
            style={{ cursor: 'pointer', }}
            height={32}
            width={32}
            src={isVn ? VietNamFlag : UnitedKingDomFlag}
            onClick={() => changeLang(isVn ? 'en' : 'vi')}
        />
    );
});

interface IconBoxProps {
    image: string;
    width: number;
    height: number;
    onClick: () => void;
}

export const IconBox = memo(({ image, width, height, onClick }: IconBoxProps) => {
    return (
        <img alt="icon" style={{ cursor: 'pointer', }} src={image} width={width} height={height} onClick={onClick} />
    );
});

export const LogoFull = memo(({ size }: { size: number }) => {
    const navigate = useNavigate();

    return (
        <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={size} onClick={() => navigate(ROUTES.homepage)} />
    );
});

function Header() {
    const { isLogin, logout, user } = useAuth();
    const { t } = usei18next();
    const navigate = useNavigate();
    const { isMobile } = useThemePage();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const [anchorEl, setAnchorEl] = useState<any>(null);

    const handlePopoverOpen = (event: React.MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const { roleName } = useAuth();


    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ background: 'none' }}
            >
                <Box
                    sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                        borderBottom: (theme) => `1px solid ${theme.palette.action.disabledBackground}`,
                    }}>
                    <ListItem sx={{ padding: "24px 0px 24px 32px" }}>
                        <LogoFull size={200} />
                    </ListItem>
                    {isMobile ? (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <ListItem sx={{ padding: "18px 32px 18px 0px", display: 'flex', justifyContent: 'end', gap: "16px" }}>
                            <IconButton >
                                <LanguageBox />
                            </IconButton>

                            <IconButton >
                                <Badge badgeContent={100} color="primary">
                                    <IconBox image={NotificationIcon} width={24} height={28.23} onClick={() => navigate(ROUTES.homepage)} />
                                </Badge>
                            </IconButton>
                            <Divider sx={{ borderLeft: '1px solid #B1B5C3', height: 32 }} />
                            <div
                                aria-owns={open ? 'hover-menu' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={() => setAnchorEl(null)}
                            >
                                <Avatar src={isLogin ? (user && user.avatarUrl ? user.avatarUrl : '') : ''} />
                                <Popover
                                    sx={{ marginTop: '8px' }}
                                    id="hover-menu"
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: "right",
                                    }}
                                    color='primary'
                                >
                                    {isLogin ? (
                                        <>
                                            <MenuItem
                                                onClick={() => {
                                                    setAnchorEl(null);
                                                    navigate(ROUTES.user.userprofile);
                                                }}
                                                //hover to change background color
                                                sx={{ textAlign: 'center' }}
                                            >
                                                {t('header.userprofile')}
                                            </MenuItem>
                                            {roleName === 'Admin' ? (
                                                <MenuItem
                                                    onClick={() => {
                                                        setAnchorEl(null);
                                                        navigate(ROUTES.admin.managemotorbikes);
                                                    }}
                                                    //hover to change background color
                                                    sx={{ textAlign: 'center' }}
                                                >
                                                    {t('header.dashboard')}
                                                </MenuItem>) : null
                                            }
                                            <MenuItem
                                                onClick={() => {
                                                    setAnchorEl(null);
                                                    UserService.logout();
                                                    logout();
                                                }}
                                                sx={{ textAlign: 'center' }}
                                            >
                                                {t('header.logout')}
                                            </MenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <MenuItem
                                                onClick={() => {
                                                    setAnchorEl(null);
                                                    navigate(ROUTES.account.register);
                                                }}
                                                sx={{ textAlign: 'center' }}
                                            >
                                                {t('header.register')}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    setAnchorEl(null);
                                                    navigate(ROUTES.account.login);
                                                }}
                                                sx={{ textAlign: 'center' }}
                                            >
                                                {t('header.login')}
                                            </MenuItem>
                                        </>
                                    )}
                                </Popover>
                            </div>
                        </ListItem>
                    )}
                </Box>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
            >
                <div
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <List>
                        {isLogin ? (
                            <>
                                <ListItem onClick={() => navigate(ROUTES.user.userprofile)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t('header.userprofile')} />
                                </ListItem>
                                <ListItem onClick={() => navigate(ROUTES.admin.managemotorbikes)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t('header.dashboard')} />
                                </ListItem>
                                <ListItem onClick={() => {
                                    UserService.logout();
                                    logout();
                                }} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t('header.logout')} />
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem onClick={() => navigate(ROUTES.account.register)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t('header.register')} />
                                </ListItem>
                                <ListItem onClick={() => navigate(ROUTES.account.login)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t('header.login')} />
                                </ListItem>
                            </>
                        )}
                        <ListItem>
                            <LanguageBox />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
}

export default Header;
