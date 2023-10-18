import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";

interface Location {
    lat: number;
    lng: number;
}

export default function MyMapArea() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });

    if (!isLoaded) return <div>Loading...</div>
    return (
        <MyMap />
    )
}

// function MyMap() {
//     return (
//         <GoogleMap
//             zoom={10}
//             center={{ lat: 6.9271, lng: 79.8612 }}
//             mapContainerStyle={{ width: "80%", height: "100vh" }}
//         >
//             <Marker position={{ lat: 6.9271, lng: 79.8612 }} />
//         </GoogleMap>
//     )
// }



function MyMap() {
    const center = useMemo(() => ({ lat: 21.0130202, lng: 105.5265034 }), []);
    const [selected, setSelected] = useState<Location>(center);
    console.log(selected)
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setSelected({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

    return (
        <>
            <PlacesAutocomplete setSelected={setSelected} />
            <GoogleMap
                zoom={18}
                center={selected ? selected : center}
                mapContainerStyle={{ width: "100vh", height: "110vh" }}
                onDblClick={(e) => {
                    if (e.latLng) {
                        setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    }
                }}
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
        </>
    );
}

const PlacesAutocomplete = ({ setSelected }: { setSelected: any }) => {
    const {
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: any) => {
        setValue(address, false);
        clearSuggestions();
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    };

    return (
        <Select onSelect={handleSelect} value={value} fullWidth>
            <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {status === "OK" &&
                data.map(({ place_id, description }) => (
                    <MenuItem key={place_id} value={description} onClick={() => handleSelect(description)}>
                        <Typography>{description}</Typography>
                    </MenuItem>
                ))}
        </Select>
    );
};