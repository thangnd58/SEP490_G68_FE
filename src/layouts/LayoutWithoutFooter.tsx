import React from 'react'
import { Box } from '@mui/material'
import Header from './components/Header';

export interface LayoutWithoutFooterProps {
    children: JSX.Element;
}

const LayoutWithoutFooter = ({ children }: LayoutWithoutFooterProps) => {
    return (
        <Box>
            <Header />
            <Box >{children}</Box>
        </Box>
    )
}

export default LayoutWithoutFooter;