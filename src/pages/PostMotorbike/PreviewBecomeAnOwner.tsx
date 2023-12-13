import React, { useState } from 'react'
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
import { LoginModal } from '../AccountPage/LoginModal';
import UserService from '../../services/UserService';

export default function PreviewBecomeAnOwner() {
    const navigate = useNavigate();
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} p={2}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} width={isMobile ? "100%" : '90%'} gap={1}>
                <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    justifyContent={isMobile ? 'start' : 'center'}
                    gap={3}
                    width={'100%'}
                >
                    <Box onClick={
                        () => navigate(ROUTES.user.listmotorbike)
                    }
                        display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} sx={{
                            cursor: 'pointer',
                            position: isMobile ? "none" : 'absolute',
                            left: isMobile ? "none" : "32px",
                        }}>
                        {/* Icon Back */}
                        <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.black }} />} hasTooltip tooltipText={""} onClick={() => { }} position='bottom' />

                        {/* Typography Back */}
                        <Typography
                            sx={{
                                color: 'common.black',
                                fontWeight: '400',
                                fontSize: isMobile ? 14 : 16,
                                textAlign: 'center',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {t("postMotorbike.registedForm.badge-back")}
                        </Typography>
                    </Box>

                    {/* Typography in the middle */}
                    <Typography
                        sx={{
                            color: 'common.black',
                            fontWeight: '600',
                            fontSize: isMobile ? 28 : 32,
                            textAlign: 'center',
                        }}
                    >
                        {t("editional.register_motorbike")}
                    </Typography>
                </Box>

                <Box display={'flex'} flexDirection={isMobile ? 'column' : 'row'} alignItems={'center'} justifyContent={'center'} width={'100%'} gap={3}>
                    {/* Ảnh */}
                    <Avatar
                        src={BecomeAnOwner} variant='rounded'
                        sx={{
                            width: isMobile ? "100%" : '40%',
                            height: isMobile ? "100%" : '40%',
                            animation: "fadeInRight 1s ease-out"
                        }}
                    />

                    {/* Back */}
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={2}
                        sx={{
                            animation: "fadeInLeft 1s ease-out"
                        }}
                    >
                        {
                            isMobile ? (
                                <Typography sx={{ color: 'common.black', fontWeight: '500', fontSize: isMobile ? 16 : 20, textAlign: 'center', width: "100%" }}>
                                    {t("editional.JoinWithUs")}
                                </Typography>
                            ) : (

                                <Typography sx={{ color: 'common.black', fontWeight: '500', fontSize: isMobile ? 16 : 20, textAlign: 'center', width: "100%" }}>
                                    {t("editional.JoinWithUs")}
                                </Typography>
                            )
                        }
                        {/* Content */}
                        {/* Đăng ký thuê xe để tăng thêm thu nhập  */}
                        <MyCustomButton width={isMobile ? "100%" : "auto"} onClick={() => !UserService.isLoggedIn() ? setIsOpenLoginModal(true) : navigate(ROUTES.user.registermotorbike)} content={t("homepage.btn_registernow")} />
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={1}
                            sx={{
                                backgroundColor: "rgba(139, 69, 19, 0.15)",
                                borderRadius: '8px',
                                padding: '16px 16px',
                            }}
                        >
                            {/* Thủ tục đăng ký gồm 4 bước */}

                            {/* Bước 1 */}
                            <Typography sx={{ color: 'common.black', fontWeight: '400', fontSize: isMobile ? 12 : 14, textAlign: 'start', width: "100%" }}>
                            {t("editional.step1_register")}
                            </Typography>
                            {/* Bước 2 */}
                            <Typography sx={{ color: 'common.black', fontWeight: '400', fontSize: isMobile ? 12 : 14, textAlign: 'start', width: "100%" }}>
                            {t("editional.step2_register")}
                            </Typography>
                            {/* Bước 3 */}
                            <Typography sx={{ color: 'common.black', fontWeight: '400', fontSize: isMobile ? 12 : 14, textAlign: 'start', width: "100%" }}>
                            {t("editional.step3_register")}
                            </Typography>
                            {/* Bước 4 */}
                            <Typography sx={{ color: 'common.black', fontWeight: '400', fontSize: isMobile ? 12 : 14, textAlign: 'start', width: "100%" }}>
                            {t("editional.step4_register")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <LoginModal isOpenLoginModal={isOpenLoginModal} setIsOpenLoginModal={setIsOpenLoginModal} isMobile={isMobile} />
        </Box>
    )
}
