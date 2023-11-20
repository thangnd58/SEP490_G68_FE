import React from 'react'
import MyCustomButton from '../../components/common/MyButton'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';
import { BecomeAnOwner } from '../../assets/images';
import { Avatar, Box, Typography } from '@mui/material';
import MyIcon from '../../components/common/MyIcon';
import { ArrowBack } from '@mui/icons-material';
import theme from '../../utils/theme';
import usei18next from '../../hooks/usei18next';
import useThemePage from '../../hooks/useThemePage';

export default function PreviewBecomeAnOwner() {
    const navigate = useNavigate();
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={'100%'} marginTop={2} gap={2}>
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} width={'100%'}
                onClick={() => navigate(-1)} sx={{ cursor: 'pointer', }}
            >
                {/* Icon Back */}
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={""} onClick={() => navigate(-1)} position='bottom' />
                {/* Quay lại */}
                <Typography sx={{
                    color: 'common.black', fontWeight: '400', fontSize: isMobile ? 14 : 16, textAlign: 'center',
                    '&:hover': {
                        textDecoration: 'underline',
                    }
                }}>
                    {t("postMotorbike.registedForm.badge-back")}
                </Typography>
            </Box>
            <Avatar
                src={BecomeAnOwner} variant='rounded'
                sx={{
                    width: '30%',
                    height: '30%',

                }}
            />
            {/* Đăng ký thuê xe để tăng thêm thu nhập  */}
            <MyCustomButton onClick={() => navigate(ROUTES.user.registermotorbike)} content={t("homepage.btn_registernow")} />
        </Box >
    )
}
