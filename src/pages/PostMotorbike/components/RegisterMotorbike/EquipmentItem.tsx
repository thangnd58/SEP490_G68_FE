import { Box } from '@mui/system'
import React from 'react'
import { Typography } from '@mui/material';
import theme from '../../../../utils/theme';

interface EquipmentItemProps {
    icon: any;
    label: string;
}

export default function EquipmentItem({ icon, label }: EquipmentItemProps) {
    return (
        <Box sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignContent: 'center', padding: '16px 0px', gap: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {icon}
            </Box>
            <Typography variant='h3' color={theme.palette.text.secondary} fontSize={"16px"} fontWeight={400} sx={{ wordWrap: 'break-word' }}>
                {label}
            </Typography>
        </Box>
    )
}
