import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MyBooking() {
    const [value, setValue] = React.useState(0);
    const { t } = usei18next();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box
            sx={{ width: '100%' }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '32px 0px',
                gap: '32px'
            }}
        >
            <Typography
                variant='h1'
                color={theme.palette.text.primary}
                fontSize={"32px"}
                lineHeight={"60px"}
                fontWeight={"600"}
                sx={{ textAlign: 'center' }}>
                {t("header.my_booking")}
            </Typography>
            <Paper elevation={2} sx={{ width: '80%', bgcolor: 'background.paper' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab
                            sx={{
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                lineHeight: '24px',
                                color: theme.palette.text.primary,
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main
                                }
                            }}
                            label={t("myBooking.currentBooking")}
                            {...a11yProps(0)}
                        />
                        <Tab sx={{
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            lineHeight: '24px',
                            color: theme.palette.text.primary,
                            '&.Mui-selected': {
                                color: theme.palette.primary.main
                            }
                        }} label={t("myBooking.historyBooking")} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    Item One
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Item Two
                </CustomTabPanel>
            </Paper>
        </Box>
    );
}