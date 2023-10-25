import { Box } from '@mui/system'
import React from 'react'
import { Typography, colors } from '@mui/material';
import theme from '../../../../utils/theme';
import { RepairIcon } from '../../../../assets/icons';
import { Map } from '@mui/icons-material';

interface EquipmentItemProps {
    icon: any;
    label: string;
    isChosen?: boolean;
}

export default function EquipmentItem({ icon, label, isChosen }: EquipmentItemProps) {
    return (
        <Box sx={{
            border: isChosen ? `3px solid ${theme.palette.primary.main}` : `3px solid ${theme.palette.action.disabledBackground}`,
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            alignContent: 'center',
            padding: '16px 0px',
            gap: '8px',
            cursor: 'pointer',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {icon}
            </Box>
            <Typography
                variant='h3'
                color={isChosen ? theme.palette.text.primary : theme.palette.text.secondary}
                fontSize={"16px"}
                fontWeight={400}
                sx={{ wordWrap: 'break-word' }}>
                {label}
            </Typography>
        </Box>
    )
}
