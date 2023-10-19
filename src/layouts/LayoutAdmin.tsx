import React from 'react'
import { AppBar, Box, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import Header from './components/Header';
import NavigationAdmin from './components/NavigationAdmin';

export interface LayoutAdminProps {
    children: JSX.Element;
}

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
    return (
        <Box>
            <Header />
            <Box display={'flex'}>
                <Grid container>
                    <Grid item xs={2} borderRight={'1px solid'}>
                        <NavigationAdmin />
                    </Grid>
                    <Grid item xs={10} sx={{ height: '88vh', width: '100%' }}>
                        {children}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default LayoutAdmin;