import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box } from '@mui/material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomizedSnackbarsProps {
    autoHideDuration: number;
    severity: "success" | "error" | "warning" | "info";
    message: string;
    open: boolean;
};

export function CustomizedSnackbars(props: CustomizedSnackbarsProps) {
    const [open, setOpen] = React.useState(props.open);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Box>   
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                autoHideDuration={props.autoHideDuration}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={props.severity} sx={{ width: "100%" }}>
                    {props.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}