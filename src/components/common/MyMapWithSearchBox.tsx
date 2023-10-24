import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Box, Button, CircularProgress, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import theme from "../../utils/theme";
import { LocationCity, MyLocation } from "@mui/icons-material";
import usei18next from "../../hooks/usei18next";
import { on } from "events";


interface Location {
    lat: number;
    lng: number;
}

export default function MyMapWithSearchBox() {
    // API key 
    

    // check if map is loaded
    

    return (
        <>
        </>
    );
}