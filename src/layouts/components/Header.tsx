import React, { memo, useContext, useState } from 'react'
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, OutlinedInput, Popover, TextField, Typography } from '@mui/material'
import UserService from '../../services/UserService'
import { AuthContext } from '../../contexts/AuthContext'
import usei18next from '../../hooks/usei18next'
import { useNavigate } from 'react-router'
import MenuIcon from '@mui/icons-material/Menu'
import useThemePage from '../../hooks/useThemePage'
import { Notifications, Search } from '@mui/icons-material'
import { LogoHeader } from '../../assets/images'
import { ROUTES } from '../../utils/Constant'

export const LanguageBox = memo(() => {
    const { isVn, changeLang } = usei18next();
    return (
        <Divider sx={{ cursor: 'pointer', fontWeight: '700', color: '#777E90' }}>
            {
                isVn ? <span onClick={() => changeLang("en")} >Viet Nam</span> : <span onClick={() => changeLang("vi")}>English</span>
            }
        </Divider>
    )
})

export const Logo = memo(({size} : {size: number})  => {
    const navigate = useNavigate();
    return (
        <img src={LogoHeader} width={size} onClick={() => navigate(ROUTES.homepage)} />
    )
})

function Header() {
    const { isLogin, logout, user } = useContext(AuthContext);
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

    return (
        <>
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}`, background: '#FFF' }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <ListItem>
                        <Logo size={250} />
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
                        <ListItem sx={{ display: 'flex', justifyContent: 'end' }}>
                            <LanguageBox />
                            <Notifications sx={{ fill: 'none', stroke: '#777E90', marginRight: '1%' }} />
                            <Divider 
                                sx={{ borderLeft: '1px solid' }}
                                aria-owns={open ? 'hover-menu' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={() => setAnchorEl(null)}
                            >
                                <Avatar src={isLogin ? (user && user.avatar ? user.avatar : "") : ("")} />
                                <Popover
                                    id="hover-menu"
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    {
                                        isLogin ? <>
                                        <MenuItem onClick={() => {
                                            setAnchorEl(null)
                                            navigate(ROUTES.user.userprofile)
                                        }}
                                            sx={{ textAlign: 'center', textTransform: 'uppercase' }}
                                        >
                                            {t("header.userprofile")}
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            setAnchorEl(null);
                                            UserService.logout();
                                            logout();
                                        }}
                                            sx={{ textAlign: 'center', textTransform: 'uppercase' }}
                                        >
                                            {t("header.logout")}
                                        </MenuItem>
                                        </>
                                         : (
                                            <>
                                                <MenuItem onClick={() => {
                                                    setAnchorEl(null)
                                                    navigate(ROUTES.account.register)
                                                }}
                                                    sx={{ textAlign: 'center', textTransform: 'uppercase' }}
                                                >
                                                    {t("header.register")}
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    setAnchorEl(null)
                                                    navigate(ROUTES.account.login)
                                                }}
                                                    sx={{ textAlign: 'center', textTransform: 'uppercase' }}
                                                >
                                                    {t("header.login")}
                                                </MenuItem>
                                            </>
                                        )
                                    }

                                </Popover>
                            </Divider>
                        </ListItem>
                    )}
                </Box>
            </AppBar >
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
                        {
                            isLogin ? <>
                                <ListItem onClick={() => navigate(ROUTES.user.userprofile)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t("header.userprofile")} />
                                </ListItem>
                                <ListItem onClick={() => {
                                    UserService.logout();
                                    logout();
                                }} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t("header.logout")} />
                                </ListItem>
                            </> : <>
                                <ListItem onClick={() => navigate(ROUTES.account.register)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t("header.register")} />
                                </ListItem>
                                <ListItem onClick={() => navigate(ROUTES.account.login)} sx={{ borderBottom: '1px solid gray' }}>
                                    <ListItemText primary={t("header.login")} />
                                </ListItem>
                            </>
                        }

                        <ListItem>
                            <LanguageBox />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    )
}

export default Header
