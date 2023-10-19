import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Box, Button, CircularProgress, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import theme from "../../utils/theme";
import { LocationCity, MyLocation } from "@mui/icons-material";



import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { CustomizedSnackbars } from "./MyMapArea";


interface Location {
    lat: number;
    lng: number;
}

export default function MyMapWithSearchBox() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });

    if (!isLoaded) return <Box sx={{
        display: 'flex', justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    }}>
        <CircularProgress />
    </Box>;
    return <MyMap />;
}

function MyMap() {
    const center = useMemo(() => ({ lat: 21.011265863657588, lng: 105.78563526376422 }), []);
    const [selected, setSelected] = useState<Location>(center);
    const [showMenu, setShowMenu] = useState(false);


    const handleGetLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setSelected({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                getGeocode({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                }).then((results) => {
                    setValue(results[0].formatted_address, false);
                    setShowMenu(false);
                });
            });
        }
    };


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
        setShowMenu(false);
    };

    useEffect(() => {
        if (value.trim() === '' || data.length === 0) {
            setShowMenu(false);
        }
    }, [value]);

    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <TextField
                    sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root fieldset": { borderRadius: "8px" },
                        "& .MuiOutlinedInput-root:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                        }
                    }}
                    placeholder={"Tìm kiếm địa chỉ của bạn"}
                    fullWidth
                    value={value}
                    SelectProps={{
                        native: true,
                    }}
                    onChange={(e) => {
                        ;
                        setValue(e.target.value);
                        setShowMenu(true);
                    }}
                ></TextField>
                <Box
                    position="absolute"
                    display={showMenu ? "block" : "none"}
                    margin={"8px auto"}
                    width={"100%"}
                    top="100%"
                    zIndex="1"
                    sx={{ backgroundColor: "#ffffff" }}
                    border={"3px solid #ebebeb"}
                    borderRadius={"8px"}>
                    {status === "OK" &&
                        data.map(({ place_id, description }) => (
                            <MenuItem
                                dense
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#ebebeb" },
                                    width: "99%",
                                    borderBottom: "1px solid #ebebeb",
                                    color: "#000000",
                                    whiteSpace: "normal", // Cho phép nội dung tự động xuống dòng
                                    wordWrap: "break-word", // Tự động xuống dòng khi cần thiết
                                    // whiteSpace: "nowrap", // Ngăn menu item xuống dòng tự động
                                    // overflow: "hidden", // Ẩn nội dung bị tràn
                                    // textOverflow: "ellipsis", // Hiển thị "..." cho nội dung tràn
                                }}
                                key={place_id}
                                value={description}
                                onClick={() => handleSelect(description)}
                            >
                                <Typography
                                >
                                    {description}
                                </Typography>
                            </MenuItem>
                        ))}
                </Box>
            </div>
            <Box
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
                flexDirection={"row"}
                margin={"8px auto"}
            >
                <IconButton
                    size="small"
                    color="primary"
                    onClick={handleGetLocationClick}
                >
                    <MyLocation />
                </IconButton>
                <Typography variant="caption" fontSize={"12px"} color={theme.palette.text.secondary}>Lấy vị trí của bạn</Typography>
            </Box>
            <Box
                borderRadius={"8px"}
                border={"3px solid"}
                margin={"0px auto"}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
            >
                <GoogleMap
                    zoom={18}
                    center={selected ? selected : center}
                    mapContainerStyle={{
                        width: "100%",
                        height: "40vh",
                        borderRadius: "8px",
                    }}
                    onDblClick={(e) => {
                        if (e.latLng) {
                            setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                        }
                    }}
                >
                    {selected && <Marker position={selected} />}
                </GoogleMap>
            </Box>
        </>
    );
}
