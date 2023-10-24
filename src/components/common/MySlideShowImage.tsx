import { Box } from '@mui/material';
import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'


interface CreateFadeEffectImageProps {
    images: string[];
    autoPlay?: boolean;
    duration?: number;
    transitionDuration?: number;
    indicators?: boolean;
    arrows?: boolean;
}

export default function MySlideShowImage(props: CreateFadeEffectImageProps) {
    return (
        console.log(props.images),
        <Box className="slide-container">
            <Fade
            autoplay={props.autoPlay ? props.autoPlay : false}
            >
                {props.images.map((item) => (
                    <Box key={item} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img style={{
                            borderRadius: '8px',
                            border: '8px solid #E0E0E0',
                            width: '100px',
                            height: '100px'
                        }} src={item} />
                    </Box>
                ))}
            </Fade>
        </Box>
    )
}