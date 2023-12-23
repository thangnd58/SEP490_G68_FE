import { Box, Typography } from '@mui/material'
import React from 'react'
import useThemePage from '../../../hooks/useThemePage';
import { BeAOwner, BeAOwnerEN } from '../../../assets/images';
import MyCustomButton from '../../../components/common/MyButton';
import { Loyalty } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { GuildlineType, ROUTES } from '../../../utils/Constant';

export default function DoYouWantToBeAOwner() {
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    const { isVn, t } = usei18next();

    return (

        <Box
            padding={isMobile ? '32px' : '32px 64px'}
        >
            <Box
                display={'flex'}
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                width={'100%'}
            >
                {/* image */}
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={isMobile ? '100%' : '50%'} height={'100%'}>
                    <img src={isVn ? BeAOwner : BeAOwnerEN} alt={'owner'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                {/* content */}
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={isMobile ? '100%' : '50%'} height={'100%'}>
                    <Typography sx={{ color: 'common.black', fontWeight: 'bold', fontSize: isMobile ? 24 : 48, textAlign: 'center' }}>
                        {t("header.be_a_owner")}
                    </Typography>
                    <Typography sx={{ color: 'common.black', fontSize: isMobile ? 14 : 16, textAlign: 'center' }}>
                        {t("header.be_a_owner_content")}
                    </Typography>
                    {/* Action button */}
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'100%'} marginTop={isMobile ? 2 : 4} gap={2}>
                        <MyCustomButton
                            width={'auto'}
                            fontWeight={isMobile ? 500 : 600}
                            onClick={() =>
                                navigate(
                                    ROUTES.user.previewbecomeanowner
                                )
                            }
                            content={t("homepage.btn_registernow")}
                        />
                        <MyCustomButton
                            width={'auto'}
                            fontWeight={isMobile ? 500 : 600}
                            onClick={() =>
                                navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.general}`)
                            }
                            content={t("homepage.btn_viewmore")}
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </Box >
        </Box >
    )
}
