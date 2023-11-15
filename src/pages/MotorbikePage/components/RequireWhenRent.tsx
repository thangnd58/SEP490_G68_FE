import { Box, List, ListItem, Typography, styled } from "@mui/material"
import usei18next from "../../../hooks/usei18next"
import useThemePage from "../../../hooks/useThemePage";
import { DirveLicenceImage, PassportImage } from "../../../assets/images";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VerifyIcon, WarningIcon } from "../../../assets/icons";
import { Warning, WarningAmber } from "@mui/icons-material";
import theme from "../../../utils/theme";

const TableStyle = styled('div')(({ theme }) => ({
    '& .MuiTableCell-root': {
        border: 'none'
    },
}));


export const RequireWhenRent = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    return (
        <Box sx={{ width: '100%' }} display={'flex'} flexDirection={'column'} gap={'16px'}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', justifyContent: 'space-between', gap: '16px' }}>
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} width={isMobile ? '100%' : '50%'}>
                    <Typography fontWeight={'700'} color={'common.black'} >{t("policy.documentRental")}</Typography>
                    <Box display="flex" flexDirection="column" justifyContent={"start"} gap={"8px"} p={'8px'} border={"1px solid #e0e0e0"} borderRadius={"8px"}
                        height={'56px'} sx={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}
                    >
                        <Box display="flex" alignItems="center" gap={"8px"} >
                            <img src={DirveLicenceImage} alt="licence" width={24} height={24} />
                            <Typography fontSize={14} color={theme.palette.text.primary}>{t("policy.driveLicence")}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={"8px"}>
                            <img src={PassportImage} alt="passport" width={24} height={24} />
                            <Typography fontSize={14} color={theme.palette.text.primary}>{t("policy.passport")}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} width={isMobile ? '100%' : '50%'} >
                    <Typography fontWeight={'700'} color={theme.palette.text.primary} >{t("policy.collateral")}</Typography>
                    <Box display="flex" flexDirection="column" justifyContent={"center"} gap={"8px"} p={'8px'} border={"1px solid #e0e0e0"} borderRadius={"8px"} height={'56px'} sx={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}
                    >
                        <Typography fontSize={14} color={theme.palette.text.primary}>{t("policy.otherCollateral")}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '100%' }} display={'flex'} flexDirection={'column'} gap={'8px'}>
                <Typography fontWeight={'700'} color={'common.black'} >{t("policy.titlePolicy")}</Typography>
                <List sx={{ listStyleType: 'disc', px: '22px', border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: 'rgba(139, 69, 19, 0.05)' }} >
                    <ListItem sx={{
                        color: '#000',
                        display: 'list-item',
                        textAlign: 'justify',
                        fontSize: "14px",
                        padding: '4px 0px'
                    }}
                    >{t("policy.requireYearOld")}</ListItem>
                    <ListItem sx={{
                        color: '#000',
                        display: 'list-item',
                        textAlign: 'justify',
                        fontSize: "14px",
                        padding: '4px 0px'
                    }}>{t("policy.requireLicence")}</ListItem>
                    <ListItem sx={{
                        color: '#000',
                        display: 'list-item',
                        textAlign: 'justify',
                        fontSize: "14px",
                        padding: '4px 0px'
                    }}>{t("policy.requireReadPolicy")}</ListItem>
                </List>
            </Box>
            <Box sx={{ width: '100%' }} display={'flex'} flexDirection={'column'} gap={'8px'}>
                <Typography fontWeight={'700'} color={'common.black'} >{t("policy.policyCancelBooking")}</Typography>
                <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} width={'100%'}>
                    <TableContainer
                        component={Paper}
                        sx={{ width: '99.5%', border: '1px solid #e0e0e0', boxShadow: 'none' }} >
                        <TableStyle>
                            <Table
                                sx={{
                                    minWidth: '670px',
                                    borderCollapse: 'separate',
                                }}

                                aria-label="simple table"
                            >
                                <TableHead >
                                    <TableRow>
                                        <TableCell>{t("policy.headerTimeCancel")}</TableCell>
                                        <TableCell >{t("policy.headerCustomerCancel")}</TableCell>
                                        <TableCell >{t("policy.headerMotorbikeOwnerCancel")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        key={1}
                                    >
                                        <TableCell component="th" scope="row">
                                            {t("policy.in1Hour")}
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><VerifyIcon /> {t("policy.refundAll")}</TableCell>
                                        <TableCell >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <VerifyIcon /> {t("policy.noRefundOwner")}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={2}
                                    >
                                        <TableCell component="th" scope="row">
                                            {t("policy.before3DayStart")}
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><VerifyIcon /> {t("policy.refund70")}</TableCell>
                                        <TableCell >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <VerifyIcon /> {t("policy.refund30Owner")}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow
                                        key={3}
                                    >
                                        <TableCell component="th" scope="row">
                                            {t("policy.in3Day")}
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}><WarningIcon /> {t("policy.noRefund")}</TableCell>
                                        <TableCell >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <WarningIcon /> {t("policy.refund100Owner")}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableStyle>
                    </TableContainer>
                    <List sx={{ listStyleType: 'disc', pl: '22px', width: '100%' }} >
                        <ListItem sx={{
                            color: '#000',
                            display: 'list-item',
                            textAlign: 'justify',
                            fontSize: "12px",
                            padding: '4px 0px'
                        }}>{t("policy.freeCancel1hour")}</ListItem>
                        <ListItem sx={{
                            color: '#000',
                            display: 'list-item',
                            textAlign: 'justify',
                            fontSize: "12px",
                            padding: '4px 0px'
                        }}>{t("policy.customerNotGetMotorbike")}</ListItem>
                        <ListItem sx={{
                            color: '#000',
                            display: 'list-item',
                            textAlign: 'justify',
                            fontSize: "12px",
                            padding: '4px 0px'
                        }} >{t("policy.moneyReturn")}</ListItem>
                    </List>
                </Box>
            </Box>
        </Box >
    )
}