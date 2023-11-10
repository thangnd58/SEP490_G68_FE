import React, { memo, useState } from 'react';
import { AppBar, Avatar, Badge, Box, Button, Divider, Drawer, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, OutlinedInput, Popover, Tooltip, Typography, } from '@mui/material';
import { AccountBox, AddShoppingCart, Circle, Close, ExitToApp, Home, ListAlt, Loyalty, ManageAccounts, Notifications, NotificationsActive, NotificationsActiveOutlined, Search, VpnKey, WalletOutlined } from '@mui/icons-material';
import { ROUTES } from '../../utils/Constant';
import { PopoverItem } from './Header';


export const Notification = (props: {isOpen: boolean, anchorEl: any}) => {


    return (
        <Popover
            sx={{ marginTop: '8px' }}
            open={props.isOpen}
            anchorEl={props.anchorEl}
            onClose={() => {
                
            }} anchorOrigin={{
                vertical: "bottom",
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: "right",
            }}
            color='primary'
        >
            <>
                <MenuItem
                    sx={{ textAlign: 'center' }}
                >
                    <PopoverItem
                        label={"123"}
                        icon={<Circle sx={{ color: "#9A9EA5" }} />} />

                </MenuItem>
            </>

        </Popover>
    )
}