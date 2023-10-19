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


interface Location {
    lat: number;
    lng: number;
}

export default function MyMapArea() {

    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    //     libraries: ["places"],
    // });

    // if (!isLoaded) return <div>Loading...</div>
    return (
        <CustomizedSnackbars />
    )
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomizedSnackbars() {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    React.useEffect(() => {
        console.log("open", open)
    }, []);

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
                autoHideDuration={1000}
                TransitionComponent={Slide}
                transitionDuration={{ enter: 1000, exit: 2000 }}
                TransitionProps={{ enter: true, exit: false }}
                onClose={handleClose}
                //message="Cool styling!"
                action={action}
                sx={{
                    //width: 400,
                    color: "secondary",
                    //backgroundColor: "green",
                    "& .MuiSnackbarContent-root": { backgroundColor: "green" }
                }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    This is a success message! <br />
                    test
                </Alert>
            </Snackbar>
        </div>
    );
}

// function MyMap() {
//     const center = useMemo(() => ({ lat: 21.0130202, lng: 105.5265034 }), []);
//     const [selected, setSelected] = useState<Location>(center);
//     console.log(selected)
//     useEffect(() => {
//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 setSelected({
//                     lat: position.coords.latitude,
//                     lng: position.coords.longitude,
//                 });
//             });
//         }
//     }, []);

//     return (
//         <>
//             <PlacesAutocomplete setSelected={setSelected} />
//             <GoogleMap
//                 zoom={18}
//                 center={selected ? selected : center}
//                 mapContainerStyle={{ width: "100vh", height: "110vh" }}
//                 onDblClick={(e) => {
//                     if (e.latLng) {
//                         setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() });
//                     }
//                 }}
//             >
//                 {selected && <Marker position={selected} />}
//             </GoogleMap>
//         </>
//     );
// }

// const PlacesAutocomplete = ({ setSelected }: { setSelected: any }) => {
//     const {
//         value,
//         setValue,
//         suggestions: { status, data },
//         clearSuggestions,
//     } = usePlacesAutocomplete();

//     const handleSelect = async (address: any) => {
//         setValue(address, false);
//         clearSuggestions();
//         const results = await getGeocode({ address });
//         const { lat, lng } = await getLatLng(results[0]);
//         setSelected({ lat, lng });
//     };

//     return (
//         <Select onSelect={handleSelect} value={value} fullWidth>
//             <TextField
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//             />
//             {status === "OK" &&
//                 data.map(({ place_id, description }) => (
//                     <MenuItem key={place_id} value={description} onClick={() => handleSelect(description)}>
//                         <Typography>{description}</Typography>
//                     </MenuItem>
//                 ))}
//         </Select>
//     );
// };