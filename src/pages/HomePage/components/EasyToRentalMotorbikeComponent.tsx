import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import useThemePage from '../../../hooks/useThemePage';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { EsayToRentalMotorbike, EsayToRentalMotorbikeEN, Feedback, Pay, Scooter, Tap } from '../../../assets/images';

export default function EasyToRentalMotorbikeComponent() {
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    const { isVn, t } = usei18next();

    return (
        <Box padding={isMobile ? '32px 32px 0px 32px' : '32px 64px 0px 64px'} sx={{ backgroundColor: "#F1F1F1" }}>
            <Box
                display={'flex'}
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={'100%'}
                gap={isMobile ? 2 : 4}
            >
                {/* content */}
                <Box display={'flex'} flexDirection={'column'} alignItems={isMobile ? 'center' : 'start'} justifyContent={'center'} width={isMobile ? '100%' : '60%'} height={'100%'}
                >
                    <Typography
                        variant={'h4'}
                        sx={{ color: 'common.black', fontWeight: 'bold', fontSize: isMobile ? 24 : 48, textAlign: isMobile ? 'center' : 'start' }}
                    >
                        {t('editional.easyToRental')}
                    </Typography>
                    <Typography sx={{ color: 'common.black', fontSize: isMobile ? 14 : 16, textAlign: isMobile ? 'center' : 'start' }}>
                        {t('editional.easyToRentalDes')}
                    </Typography>
                    {/* Step */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={isMobile ? 'center' : 'start'} flexWrap='wrap'
                        width={'100%'} height={'100%'} marginTop={isMobile ? 2 : 4} gap={2}>
                        {/* Đặt xe trên web Wandro */}
                        <EasyToRentalItem icon={Tap} isMobile={isMobile} content={t('editional.step1')} />
                        {/* Thanh toán và nhận xe */}
                        <EasyToRentalItem icon={Pay} isMobile={isMobile} content={t('editional.step2')} />
                        {/* Tận hưởng chuyến đi */}
                        <EasyToRentalItem icon={Scooter} isMobile={isMobile} content={t('editional.step3')} />
                        {/* Trả xe và kết thúc chuyến đi */}
                        <EasyToRentalItem icon={Feedback} isMobile={isMobile} content={t('editional.step4')} />
                    </Box>
                </Box>
                {/* image */}
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={isMobile ? '100%' : '40%'} height={'100%'}>
                    <img src={isVn ? EsayToRentalMotorbike : EsayToRentalMotorbikeEN} alt={'owner'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
            </Box>
        </Box >
    )
}
interface EasyToRentalItemProps {
    icon: any,
    isMobile: boolean,
    content: string
}

function EasyToRentalItem({ icon, isMobile, content }: EasyToRentalItemProps) {
    return (<Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={'120px'} height={'100%'} gap={2} sx={{
        borderRadius: '8px',
        padding: 2,
        backgroundColor: '#fff'
    }}>
        <Avatar sx={{
            width: 108,
            height: 108
        }} variant='square' src={icon} />
        <Typography
            align={'center'}
            sx={{
                color: 'common.black', fontSize: isMobile ? 14 : 16, textAlign: 'start',
                fontWeight: '600'
            }}
        >
            {content}
        </Typography>
    </Box>);
}
