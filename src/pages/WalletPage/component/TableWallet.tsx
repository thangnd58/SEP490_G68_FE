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
import { formatMoney } from '../../../utils/helper';
import { Typography } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import { WalletHistory } from '../../../utils/type';
import WalletService from '../../../services/WalletService';
import { DataGrid } from '@mui/x-data-grid';


function createData(
    name: string,
    total: number,
    price: number,
    type: string,
    transaction: WalletHistory[]
) {
    return {
        name,
        price,
        total,
        type,
        transaction,
    };
}



function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const { t } = usei18next();
    const columnsDeposite = [
        {
            field: 'transactionId', headerName: t("wallet.title_transaction_code"), flex: 1,
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
            field: 'create_Date', headerName: t("wallet.title_date_deposit"), flex: 1,
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
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell scope="row" >
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Typography>{row.name}</Typography>
                        <Typography>({row.total})</Typography>
                    </Box>
                </TableCell>
                <TableCell align="right">
                    {formatMoney(row.price)}
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {
                                row.type === 'NAP' ?
                                    <DataGrid
                                        sx={{
                                            '& .MuiDataGrid-virtualScroller': {
                                                minHeight: "300px",
                                            },
                                            '& .MuiDataGrid-cell:focus-within': {
                                                outline: "none",
                                            },
                                        }}
                                        rows={row.transaction}
                                        checkboxSelection={false}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 7 } },
                                        }}
                                        pageSizeOptions={[7, 10, 25]}
                                        columns={columnsDeposite}
                                        loading={row.transaction.length === 0}
                                        rowHeight={48}
                                        disableRowSelectionOnClick
                                        pagination
                                    /> :
                                    <DataGrid
                                        sx={{
                                            '& .MuiDataGrid-virtualScroller': {
                                                minHeight: "300px",
                                            },
                                            '& .MuiDataGrid-cell:focus-within': {
                                                outline: "none",
                                            },
                                        }}
                                        rows={row.transaction}
                                        checkboxSelection={false}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 7 } },
                                        }}
                                        pageSizeOptions={[7, 10, 25]}
                                        columns={columnsWithdrawal}
                                        loading={row.transaction.length === 0}
                                        rowHeight={48}
                                        disableRowSelectionOnClick
                                        pagination
                                    />
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}



export default function CollapsibleTable({ reload }: { reload: boolean }) {
    const [deposites, setDeposites] = React.useState<WalletHistory[]>([])
    const [withdrawals, setWithdrawals] = React.useState<WalletHistory[]>([])
    const { t } = usei18next();
    React.useEffect(() => {
        try {
            WalletService.depositeList().then((data) => {
                //@ts-ignore
                setDeposites(data.data)
            })
            WalletService.withdrawList().then((data) => {
                //@ts-ignore
                setWithdrawals(data.data)
            })
        } catch (error) {

        }
    }, [reload])

    //@ts-ignore
    const totalDeposits = deposites.reduce((total, it) => total + it.deposit, 0);
    //@ts-ignore
    const totalWithdrawal = withdrawals.reduce((total, it) => total + it.withdraw, 0);

    const rows = [
        createData(t("wallet.title_deposit_transaction"), deposites.length, totalDeposits, 'NAP', deposites),
        createData(t("wallet.title_withdrawal_transaction"), withdrawals.length, totalWithdrawal, 'RUT', withdrawals),
    ];

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}