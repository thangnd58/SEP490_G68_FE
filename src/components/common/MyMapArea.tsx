// import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Box, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { use } from "i18next";

export default function MyMapArea() {
    return (
        <CustomizedSnackbars autoHideDuration={1000} severity="error" message="This is a error message!" />
    )
}

interface CustomizedSnackbarsProps {
    autoHideDuration: number;
    severity: "success" | "error" | "warning" | "info";
    message: string;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function CustomizedSnackbars( { autoHideDuration, severity, message }: CustomizedSnackbarsProps) {
    const [open, setOpen] = React.useState(true);
    const [inputValue, setInputValue] = React.useState('');


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    return (
        <div>
            <Snackbar
                open={open}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                autoHideDuration={autoHideDuration}
                TransitionComponent={Slide}
                transitionDuration={{ enter: 1000, exit: 2000 }}
                TransitionProps={{ enter: true, exit: false }}
                onClose={handleClose}
                action={action}
                sx={{
                    color: "secondary",
                    "& .MuiSnackbarContent-root": { backgroundColor: "green" }
                }}
            >
                <Alert severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}