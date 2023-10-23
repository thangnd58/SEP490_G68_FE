// import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Box, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { use } from "i18next";
import { Field, Form, useFormik } from "formik";

export default function MyMapArea() {
    return (
        <CustomizedSnackbars />
    )
}

function CustomizedSnackbars() {
    const formik = useFormik({
        initialValues: {
            price: "abcv", //not Material UI. Works.
            hours: 60 //from Material UI
        },

        onSubmit: (values, actions) => {
            alert("values:" + JSON.stringify(values));
        }
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        handleReset
    } = formik;

    return (
        <>
            <TextField
                id="price"
                name="price"
                type="text"
                onChange={handleChange}
                value={values.price}
            />
            <Select name="hours" id="hours" value={values.hours} onChange={handleChange}>
                <MenuItem value={60}>01</MenuItem>
                <MenuItem value={120}>02</MenuItem>
            </Select>
            <Button type="submit" onClick={() => handleSubmit()}>Submit</Button>
        </>
    );
}