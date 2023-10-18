import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { RouterManage } from '../../routes/RoutesManagement';
import { ManagementIcon } from '../../assets/images';
import { Typography } from '@mui/material';
import { useMatch, useNavigate, useResolvedPath } from 'react-router';

export default function NavigationAdmin() {
    const navigate = useNavigate();
    
    return (
        <React.Fragment>
            <Box role="presentation">
                <Box sx={{ display: 'flex', gap: '10px', my: 1, mx: 2 }}>
                    <ManagementIcon />
                    <Typography fontSize={18}>Quản lý</Typography>
                </Box>
                <List>
                    <Divider />
                    {RouterManage.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
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
