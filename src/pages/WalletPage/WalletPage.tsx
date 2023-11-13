import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import useThemePage from '../../hooks/useThemePage';
import CollapsibleTable from './component/TableWallet';
import { formatMoney } from '../../utils/helper';
import MyCustomButton from '../../components/common/MyButton';
import { ModalContext } from '../../contexts/ModalContext';
import ModalDepositMoney from './component/ModalDepositMoney';
import { useNavigate } from 'react-router-dom';
import WalletService from '../../services/WalletService';
import { useAppSelector } from '../../hooks/useAction';
import { ROUTES } from '../../utils/Constant';
import { useDispatch } from 'react-redux';
import { getUserInfo } from '../../redux/reducers/authReducer';
import ModalStatus from './component/ModalStatus';
import { SuccessIcon } from '../../assets/images';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import ModalWithdrawalMoney from './component/ModalWithdrawalMoney';
import { PaymentService } from '../../services/PaymentService';

const DatePickerStyle = styled('div')(({ theme }) => ({
    '& .MuiTextField-root': {
        width: '190px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
            },
        },
        '& .MuiIconButton-root': {
            color: theme.palette.common.white,
        },
        '& .MuiOutlinedInput-input': {
            color: theme.palette.common.white,
        },
    },
    '& .MuiPickersPopper-root': {
        position: 'absolute',
        inset: '0px auto auto 0px',
        margin: '0px',
        transform: 'translate(527px, 231px)'
    }
}));

const Wallet = () => {
    const { t } = usei18next();
    const currentDate = dayjs();
    const { isMobile } = useThemePage();
    const { setContentModal, setShowModal } = useContext(ModalContext);
    const { user } = useAppSelector((state) => state.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [reload, setReload] = useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(currentDate);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const showModalDeposite = () => {
        setContentModal(<ModalDepositMoney title={t("wallet.title_dialog_deposite")} />)
        setShowModal(true)
    }

    const showModalWithdrawal = () => {
        setContentModal(<ModalWithdrawalMoney setReload={setReload} title={t("wallet.title_dialog_withdrawal")} />)
        setShowModal(true)
    }

    const handleConfirmDeposit = () => {
        setReload((prev) => !prev)
        navigate(ROUTES.user.wallet)
    }

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const allQueryParameters: any = {};

    for (const [key, value] of params) {
        allQueryParameters[key] = value;
    }

    useEffect(() => {
        if (allQueryParameters.vnp_ResponseCode === "00") {
            try {
                WalletService.updateMoneyToDb(search).then((data) => {
                    dispatch(getUserInfo());
                    setContentModal(<ModalStatus icon={SuccessIcon} title={t("wallet.title_status_deposite_success")} content={t("wallet.content_status_deposite_success")} handleConfirm={handleConfirmDeposit} />)
                    setShowModal(true)
                })
                PaymentService.processPaymentDb(search).then((data) => {
                    dispatch(getUserInfo());
                    setContentModal(<ModalStatus icon={SuccessIcon} title={t("Thanh toán thành công")} content={"Bạn đã thanh toán đơn đặt xe thành công. Hệ thống sẽ xử lý yêu cầu đặt xe của bạn sớm nhất"} handleConfirm={handleConfirmDeposit} />)
                    setShowModal(true)
                })
            } catch (error) {

            }
        }
    }, [])

    const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);


    return (
        <Box display={'flex'} justifyContent={'center'} margin={'2rem 0rem'}>
            <Box display={'flex'} flexDirection={'column'} gap={'1rem'} width={'80%'} textAlign={'center'}>
                <Typography variant='h4' fontSize={"32px"} fontWeight={'600'} color={'text.primary'}>
                    {t('wallet.title_my_wallet')}
                </Typography>
                <Box
                    display={'flex'}
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent={isMobile ? 'center' : 'space-between'}
                    alignItems={'center'}
                    color={'common.white'}
                    padding={'0px 16px'}
                    sx={{ backgroundColor: 'primary.main', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                >
                    <Typography variant='h6'>{t('wallet.title_summary_transaction')}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePickerStyle>
                            <DatePicker
                                slots={{
                                    openPickerIcon: isPickerOpen ? ArrowDropUp : ArrowDropDown,
                                }}
                                views={['year', 'month']}
                                value={selectedDate}
                                onChange={handleDateChange}
                                onOpen={() => setIsPickerOpen(true)}
                                onClose={() => setIsPickerOpen(false)}
                            />
                        </DatePickerStyle>
                    </LocalizationProvider>
                </Box>
                <Box>
                    <Typography variant='h5' fontWeight={'bold'}>
                        {formatMoney(user?.balance || 0)}
                    </Typography>
                    <Typography color={'text.secondary'}>
                        {t('wallet.title_current_balance')}
                    </Typography>
                </Box>
                <CollapsibleTable reload={reload} selectedDate={selectedDate} />
                <Box display={'flex'} gap={'1rem'} justifyContent={'center'} mb={'1rem'}>
                    <MyCustomButton onClick={() => showModalDeposite()} content={t("wallet.title_button_deposit")} />
                    <MyCustomButton onClick={() => showModalWithdrawal()} content={t("wallet.title_button_request_withdrawal")} variant='outlined' />
                </Box>
            </Box>
        </Box>
    );
};

export default Wallet;