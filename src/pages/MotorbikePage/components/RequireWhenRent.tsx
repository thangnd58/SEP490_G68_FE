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

const TableStyle = styled('div')(({ theme }) => ({
    '& .MuiTableCell-root': {
        border: 'none'
    },
}));


export const RequireWhenRent = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', marginTop: '8px', width: '100%', justifyContent: 'space-between', gap: '8px' }}>
                <Box display={'flex'} flexDirection={'column'} gap={'4px'} width={isMobile ? '100%' : '45%'}>
                    <Typography fontWeight={'500'} color={'common.black'} >{t("policy.documentRental")}</Typography>
                    <Box display="flex" flexDirection="column" justifyContent={"start"} gap={"8px"} p={'8px'} border={"2px solid #8B4513"} borderRadius={"8px"} height={'80px'}>
                        <Box display="flex" alignItems="center" gap={"8px"} >
                            <img src={DirveLicenceImage} alt="licence" width={36} height={36} />
                            <Typography fontSize={isMobile ? 13 : 16}>{t("policy.driveLicence")}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={"8px"}>
                            <img src={PassportImage} alt="passport" width={36} height={36} />
                            <Typography fontSize={isMobile ? 13 : 16}>{t("policy.passport")}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box display={'flex'} flexDirection={'column'} gap={'4px'} width={isMobile ? '100%' : '45%'}>
                    <Typography fontWeight={'500'} color={'common.black'} >{t("policy.collateral")}</Typography>
                    <Box display="flex" flexDirection="column" justifyContent={"center"} gap={"8px"} p={'8px'} border={"2px solid #8B4513"} borderRadius={"8px"} height={'80px'}>
                        {t("policy.otherCollateral")}
                    </Box>
                </Box>
            </Box>
            <Box sx={{ marginTop: '8px', width: '100%' }}>
                <Typography fontWeight={'500'} color={'common.black'} >{t("policy.titlePolicy")}</Typography>
                <List sx={{ listStyleType: 'disc', px: '22px', border: "2px solid #8B4513", borderRadius: "8px" }} >
                    <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.requireYearOld")}</ListItem>
                    <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.requireLicence")}</ListItem>
                    <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.requireReadPolicy")}</ListItem>
                </List>
            </Box>
            <Box sx={{ marginTop: '8px', width: '100%' }}>
                <Typography fontWeight={'500'} color={'common.black'} >{t("policy.policyCancelBooking")}</Typography>
                <Box display={'flex'} flexDirection={isMobile ? 'column' : "row"} justifyContent={'space-between'} width={'100%'}>
                    <TableContainer component={Paper} sx={{ width: isMobile ? '100%' : '70%', boxShadow: '1px 1px #888888' }} >
                        <TableStyle>
                            <Table sx={{ minWidth: '670px' }} aria-label="simple table">
                                <TableHead>
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
                    <List sx={{ listStyleType: 'disc', pl: '22px',  width: isMobile ? '100%' : '27%' }} >
                        <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.freeCancel1hour")}</ListItem>
                        <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.customerNotGetMotorbike")}</ListItem>
                        <ListItem sx={{ display: 'list-item', textAlign: 'justify' }}>{t("policy.moneyReturn")}</ListItem>
                    </List>
                </Box>
            </Box>
        </Box>
    )
}