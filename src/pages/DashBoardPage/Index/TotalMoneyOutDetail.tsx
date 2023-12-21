import { Box, Typography } from '@mui/material';
import React from 'react'
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';
import useThemePage from '../../../hooks/useThemePage';
import MyIcon from '../../../components/common/MyIcon';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
export default function TotalMoneyOutDetail() {
    const { t, isVn } = usei18next();
    const { isMobile } = useThemePage();
    const navigate = useNavigate();

    return (
        <Box height={"700px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} display={"flex"} gap={"4px"}>
                <MyIcon noPadding icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.dashboard.moneyOut")}
                </Typography>
            </Box>
            <Box sx={{
                backgroundColor: "#fff",
                borderRadius: "4px",
                display: 'flex',
                alignItems: 'center',
                p: '8px',
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                Outcome
            </Box>
        </Box>
    )
}
