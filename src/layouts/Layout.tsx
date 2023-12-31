import React from 'react'
import { Box } from '@mui/material'
import Header from './components/Header'
import Footer from './components/Footer'

const Layout = ({ children }: { children: JSX.Element }) => {
    return (
        <Box>
            <Header />
            <Box sx={{minHeight: '80vh'}} >{children}</Box>
            <Footer />
        </Box>
    )
}

export default Layout