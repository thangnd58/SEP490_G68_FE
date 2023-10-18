import React from 'react'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { env } from 'process';

export default function MyMapArea() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    });

    if (!isLoaded) return <div>Loading...</div>
    return (
        <MyMap />
    )
}

function MyMap() {
    return (
        <GoogleMap
            zoom={10}
            center={{ lat: 6.9271, lng: 79.8612 }}
            mapContainerStyle={{ width: "80%", height: "10vh" }}
        >
            <Marker position={{ lat: 6.9271, lng: 79.8612 }} />
        </GoogleMap>
    )
}
