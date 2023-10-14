import React from 'react'
import { Box } from '@mui/material'
import Header from './components/Header';

export interface LayoutWithoutFooterProps {
    children: JSX.Element;
}

const LayoutWithoutFooter = ({ children }: LayoutWithoutFooterProps) => {
    return (
        <div>
            <Header />
            <Box >{children}</Box>
        </div>
    )
}

export default LayoutWithoutFooter;