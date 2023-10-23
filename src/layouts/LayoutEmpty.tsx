import React from 'react'
import { Box } from '@mui/material'

export interface LayoutEmptyProps {
    children: JSX.Element;
}

const LayoutEmpty = ({ children }: LayoutEmptyProps) => {
    return (
        <Box>
            <Box >{children}</Box>
        </Box>
    )
}

export default LayoutEmpty;