import React from 'react'
import { Box } from '@mui/material'

export interface LayoutEmptyProps {
    children: JSX.Element;
}

const LayoutEmpty = ({ children }: LayoutEmptyProps) => {
    return (
        <div>
            <Box >{children}</Box>
        </div>
    )
}

export default LayoutEmpty;