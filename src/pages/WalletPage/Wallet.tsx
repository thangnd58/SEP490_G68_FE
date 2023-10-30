import React, { useContext } from 'react';
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
import MyDialog from '../../components/common/MyDialog';
import { ModalContext } from '../../contexts/ModalContext';
import ModalDepositeMoney from './component/ModalDepositeMoney';
import { CustomizedSnackbars } from '../../components/common/MySnackbar';

const DatePickerStyle = styled('div')(({ theme }) => ({
    '& .MuiTextField-root': {
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
}));

const Wallet = () => {
    const { t } = usei18next();
    const currentDate = dayjs();
    const { isMobile } = useThemePage();
    const { setContentModal, setShowModal } = useContext(ModalContext);
    const showModalDeposite = () => {
        setContentModal(<ModalDepositeMoney content='Haha' title='Haha' onClickAgree={() => { }} />)
        setShowModal(true)
    }
    const showModalWithdrawal = () => {
        setContentModal(<ModalDepositeMoney content='Haha' title='Haha' onClickAgree={() => { }} />)
        setShowModal(true)
    }
    return (
        <Box display={'flex'} justifyContent={'center'} marginTop={'2rem'}>
            <Box display={'flex'} flexDirection={'column'} gap={'1rem'} width={'80%'} textAlign={'center'}>
                <Typography variant='h4' fontWeight={'bold'}>
                    {t('wallet.title_my_wallet')}
                </Typography>
                <Box
                    display={'flex'}
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent={isMobile ? 'center' : 'space-between'}
                    alignItems={'center'}
                    color={'common.white'}
                    px={'2.5rem'}
                    sx={{ backgroundColor: 'primary.main', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                >
                    <Typography variant='h6'>{t('wallet.title_summary_transaction')}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePickerStyle>
                            <DatePicker
                                views={['month', 'year']}
                                defaultValue={currentDate}
                            />
                        </DatePickerStyle>
                    </LocalizationProvider>
                </Box>
                <Box>
                    <Typography variant='h5' fontWeight={'bold'}>
                        {formatMoney(0)}
                    </Typography>
                    <Typography color={'text.secondary'}>
                        {t('wallet.title_current_balance')}
                    </Typography>
                </Box>
                <CollapsibleTable />
                <Box display={'flex'} gap={'1rem'} justifyContent={'center'} mb={'1rem'}>
                    <MyCustomButton onClick={() => showModalDeposite()} content={t("wallet.title_button_deposit")} />
                    <MyCustomButton onClick={() => showModalWithdrawal()} content={t("wallet.title_button_request_withdrawal")} variant='outlined' />
                </Box>
            </Box>
        </Box>
    );
};

export default Wallet;