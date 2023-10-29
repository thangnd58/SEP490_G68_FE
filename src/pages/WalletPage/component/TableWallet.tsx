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

function createData(
    name: string,
    total: number,
    price: number,
    type: string
) {
    return {
        name,
        price,
        total,
        type,
        transaction: [
            {
                code: 'NAP0001',
                date: '2020-01-05',
                status: 'Thành công',
                changeBalance: 120000,
            },
            {
                code: 'NAP0001',
                requestDate: '2020-01-05',
                approvalDate: '2020-01-05',
                status: 'Thành công',
                changeBalance: 120000,
            }
        ],
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const { t } = usei18next();

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
                                row.type === 'NAP' ? <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t("wallet.title_transaction_code")}</TableCell>
                                            <TableCell>{t("wallet.title_date_deposit")}</TableCell>
                                            <TableCell >{t("wallet.title_status")}</TableCell>
                                            <TableCell align="right">{t("wallet.title_change_balance")}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.transaction.map((transactionRow) => (
                                            <TableRow key={transactionRow.code}>
                                                <TableCell component="th" scope="row">
                                                    {transactionRow.code}
                                                </TableCell>
                                                <TableCell>{transactionRow.date}</TableCell>
                                                <TableCell>{transactionRow.status}</TableCell>
                                                <TableCell align="right">
                                                    +{formatMoney(transactionRow.changeBalance)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table> : <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t("wallet.title_transaction_code")}</TableCell>
                                            <TableCell>{t("wallet.title_request_date")}</TableCell>
                                            <TableCell>{t("wallet.title_approval_date")}</TableCell>
                                            <TableCell >{t("wallet.title_status")}</TableCell>
                                            <TableCell align="right">{t("wallet.title_change_balance")}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.transaction.map((transactionRow) => (
                                            <TableRow key={transactionRow.code}>
                                                <TableCell component="th" scope="row">
                                                    {transactionRow.code}
                                                </TableCell>
                                                <TableCell>{transactionRow.requestDate}</TableCell>
                                                <TableCell>{transactionRow.approvalDate}</TableCell>
                                                <TableCell>{transactionRow.status}</TableCell>
                                                <TableCell align="right">
                                                    -{formatMoney(transactionRow.changeBalance)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const rows = [
    createData('Giao dịch nạp tiền', 20, 262000, 'NAP'),
    createData('Giao dịch rút tiền', 25, 262000, 'RUT'),
];

export default function CollapsibleTable() {
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