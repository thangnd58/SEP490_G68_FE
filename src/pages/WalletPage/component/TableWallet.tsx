import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatMoney, formatMoneyNew } from '../../../utils/helper';
import { Chip, Typography, styled } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { Booking, WalletHistory } from '../../../utils/type';
import WalletService from '../../../services/WalletService';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleOutline, ErrorOutline, WarningAmber } from '@mui/icons-material';
import dayjs from 'dayjs';
import useThemePage from '../../../hooks/useThemePage';
import { BookingService } from '../../../services/BookingService';
import { BookingPaymentType, BookingStatus, ROUTES } from '../../../utils/Constant';
import { ModalContext } from '../../../contexts/ModalContext';
import MyDialog from '../../../components/common/MyDialog';
import { PaymentService } from '../../../services/PaymentService';
import { useNavigate } from 'react-router-dom';


function createData(
    name: string,
    total: number,
    price: number,
    type: string,
    transaction?: WalletHistory[],
    booking?: Booking[]
) {
    return {
        name,
        price,
        total,
        type,
        transaction,
        booking
    };
}



function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const { setShowModal, setContentModal } = React.useContext(ModalContext)
    const navigate = useNavigate();

    const handleProcessPayment = async (booking: Booking) => {
        try {
            if (booking.paymentType === BookingPaymentType.UserBalance) {
                // hanle payment by wallet
                const res: any = await PaymentService.paymentWithWallet(booking.bookingId, booking.totalAmount * 1000)
                window.location.reload()
            } else {
                //handle payment by vnpay
                const res: any = await PaymentService.createRequestBooking(booking.bookingId, booking.totalAmount * 1000);
                if (res) {
                    window.location.replace(res.data);
                }
            }
        } catch (error) {

        }
    }

    const columnsDeposite = [
        {
            field: 'transactionId', headerName: t("wallet.title_transaction_code"),
            flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {`NAP${params.value}`}
                </Box>
            ),
        },
        {
            field: 'create_Date', headerName: t("wallet.title_date_deposit"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'deposit', headerName: t("wallet.title_change_balance"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    + {formatMoney(params.value || 0)}
                </Box>
            ),
        },
    ];

    const columnsWithdrawal = [
        {
            field: 'id', headerName: t("wallet.title_transaction_code"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {`RUT${params.value}`}
                </Box>
            ),
        },
        {
            field: 'create_Date', headerName: t("wallet.title_request_date"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'dateApprove', headerName: t("wallet.title_approval_date"), flex: 1,
            renderCell: (params: any) => (

                <Box>
                    {params.value ? new Date(params.value).toLocaleString() : "N/A"}
                </Box>
            ),
        },
        {
            field: 'status', headerName: t("wallet.title_status"), flex: 1,
            renderCell: (params: any) => (

                params.value === "Processing" ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t("wallet.status_withdrawal_processing")} />)
                    : params.value === "Done" ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("wallet.status_withdrawal_done")} />)
                        :
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("wallet.status_withdrawal_cancel")} />)

            ),


        },
        {
            field: 'withdraw', headerName: t("wallet.title_change_balance"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    - {formatMoney(params.value || 0)}
                </Box>
            ),
        },
    ];

    const columnsBooking = [
        {
            field: 'address', headerName: t("wallet.title_address_get_motorbike"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {`${params.value}`}
                </Box>
            ),
        },
        {
            field: 'startDatetime', headerName: t("wallet.title_startdate_rent"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'endDatetime', headerName: t("wallet.title_enddate_rent"), flex: 1,
            renderCell: (params: any) => (

                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'paymentType', headerName: t("wallet.title_type_payment"), flex: 1,
            renderCell: (params: any) => (

                params.value === BookingPaymentType.UserBalance ?
                    (<Typography>Số dư tài khoản</Typography>) :
                    (<Typography>VN Pay </Typography>)

            ),
        },
        {
            field: 'status', headerName: t("wallet.title_status_booking"), flex: 1,
            renderCell: (params: any) => (

                params.value === BookingStatus.PendingPayment ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={"Chờ thanh toán"} />)
                    : params.value === BookingStatus.Paid ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={"Đã thanh toán"} />)
                        : params.value === BookingStatus.Cancelled ?
                            (<Chip
                                sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                color="error"
                                icon={<ErrorOutline />}
                                label={"Đã hủy"} />)
                            : params.value === BookingStatus.PendingDelivery ?
                                (<Chip
                                    sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                    color="warning"
                                    icon={<WarningAmber />}
                                    label={"Chờ nhận xe"} />)
                                : params.value === BookingStatus.Delivered ?
                                    (<Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                        color="success"
                                        icon={<CheckCircleOutline />}
                                        label={"Đã nhận xe"} />)
                                    :
                                    (<Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                        color="success"
                                        icon={<CheckCircleOutline />}
                                        label={"Hoàn thành "} />)

            ),
        },
        {
            field: 'totalAmount', headerName: t("wallet.title_total_amount"), flex: 1,
            renderCell: (params: any) => (
                <Box>
                    {formatMoneyNew(params.value)}
                </Box>
            ),
        }
    ];

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    backgroundColor: '#f5f5f5'
                }}>
                <TableCell scope="row" >
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                        <Typography>{row.name}</Typography>
                        <Typography>({row.total})</Typography>
                    </Box>
                </TableCell>
                <TableCell align="right">
                    {
                        row.price >= 0 && formatMoney(row.price)
                    }
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6} >
                    <Collapse in={open} unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {
                                row.total === 0 ? (
                                    <Typography
                                        variant='body1'
                                        padding={"1rem 0rem"}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        {t("wallet.title_no_transaction")}
                                    </Typography>
                                ) : (
                                    row.type === 'NAP' &&
                                    (
                                        <DataGrid
                                            sx={{
                                                '& .MuiDataGrid-cell:focus-within': {
                                                    outline: "none",
                                                },
                                                width: isMobile ? '800px' : '100%'
                                            }}
                                            rows={row.transaction!}
                                            checkboxSelection={false}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 7 } },
                                            }}
                                            pageSizeOptions={[7, 10, 25]}
                                            columns={columnsDeposite}
                                            loading={row.transaction?.length === 0}
                                            rowHeight={48}
                                            disableRowSelectionOnClick
                                            pagination

                                        />
                                    )
                                    ||
                                    row.type === 'RUT' &&
                                    (
                                        <DataGrid
                                            sx={{
                                                '& .MuiDataGrid-cell:focus-within': {
                                                    outline: "none",
                                                },
                                                width: isMobile ? '800px' : '100%'
                                            }}
                                            rows={row.transaction!}
                                            checkboxSelection={false}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 7 } },
                                            }}
                                            pageSizeOptions={[7, 10, 25]}
                                            columns={columnsWithdrawal}
                                            loading={row.transaction?.length === 0}
                                            rowHeight={48}
                                            disableRowSelectionOnClick
                                            pagination
                                        />
                                    )
                                    ||
                                    row.type === 'BOOK' && (
                                        <DataGrid
                                            sx={{
                                                '& .MuiDataGrid-cell:focus-within': {
                                                    outline: "none",
                                                },
                                                width: isMobile ? '800px' : '100%'
                                            }}
                                            getRowId={(row) => row.bookingId}
                                            rows={row.booking!}
                                            checkboxSelection={false}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 7 } },
                                            }}
                                            pageSizeOptions={[7, 10, 25]}
                                            columns={columnsBooking}
                                            loading={row.booking?.length === 0}
                                            rowHeight={48}
                                            disableRowSelectionOnClick
                                            pagination
                                            onRowClick={(event) => {
                                                if (event.row.status !== BookingStatus.Cancelled) {
                                                    navigate(`/${ROUTES.booking.detail}/${event.row.bookingId}`)
                                                }
                                                // setContentModal(<MyDialog title='Thanh toán đơn đặt xe' content='Bạn có đồng ý thanh toán hay không?' hasAgreeButton={true} hasCancelButton={true} onClickAgree={() => handleProcessPayment(event.row)} />)
                                            }}
                                        />
                                    )
                                )
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const TableStyle = styled('form')(({ theme }) => ({
    '& .MuiTableCell-root': {
        border: 'none'
    },
}));

export default function CollapsibleTable({ reload, selectedDate }: { reload: boolean, selectedDate: dayjs.Dayjs }) {
    const [deposites, setDeposites] = React.useState<WalletHistory[]>([])
    const [withdrawals, setWithdrawals] = React.useState<WalletHistory[]>([])
    const [bookings, setBookings] = React.useState<Booking[]>([])
    const { t } = usei18next();
    React.useEffect(() => {
        try {
            WalletService.depositeList(selectedDate).then((data) => {
                //@ts-ignore
                setDeposites(data.data)
            })
            WalletService.withdrawList(selectedDate).then((data) => {
                //@ts-ignore
                setWithdrawals(data.data)
            })
            BookingService.getListBookingCurrentUser().then((data) => {
                //@ts-ignore
                setBookings(data)
            })
        } catch (error) {

        }
    }, [reload, selectedDate])

    //@ts-ignore
    const totalDeposits = deposites.reduce((total, it) => total + it.deposit, 0);
    //@ts-ignore
    const totalWithdrawal = withdrawals.reduce((total, it) => total + it.withdraw, 0);
    const rows = [
        createData(t("wallet.title_deposit_transaction"), deposites.length, totalDeposits, 'NAP', deposites, []),
        createData(t("wallet.title_withdrawal_transaction"), withdrawals.length, totalWithdrawal, 'RUT', withdrawals, []),
        createData(t("wallet.title_history_booking"), bookings.length, -1, "BOOK", [], bookings)
    ];

    return (
        <TableStyle>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" >
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </TableStyle>

    );
}