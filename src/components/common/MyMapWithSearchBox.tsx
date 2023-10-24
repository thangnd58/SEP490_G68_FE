import { Box } from '@mui/material';
import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const fadeImages = [
    
  'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
];

interface CreateFadeEffectImageProps {
    images: string[];
    autoPlay?: boolean;
    duration?: number;
    transitionDuration?: number;
    indicators?: boolean;
    arrows?: boolean;
}

export default function MyMapWithSearchBox() {
    return (
        <Box className="slide-container">
            <Fade>
                {fadeImages.map((index) => (
                    <Box key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img style={{
                            borderRadius: '8px',
                            width: '90%',
                        }} src={index} />
                    </Box>
                ))}
            </Fade>
        </Box>
    )
}