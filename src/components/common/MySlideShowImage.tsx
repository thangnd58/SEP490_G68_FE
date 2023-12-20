import { Box } from '@mui/material';
import React from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import useThemePage from '../../hooks/useThemePage';


interface CreateFadeEffectImageProps {
    images: string[];
    autoPlay?: boolean;
    duration?: number;
    transitionDuration?: number;
    indicators?: boolean;
    arrows?: boolean;
    isMobile?: boolean;
}

export default function MySlideShowImage(props: CreateFadeEffectImageProps) {
    return (
        <Box className="slide-container" width={"100%"}>
            <Fade
                autoplay={true}
                duration={3000}
                canSwipe={true}
                pauseOnHover={true}
            >
                {props.images.map((item) => (
                    <Box key={item}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <img
                            style={{
                                borderRadius: '8px',
                                alignContent: 'center',
                                justifyContent: 'center',
                                height: props.isMobile ? '300px' : '468px',
                                width: props.isMobile ? '100%' : '60%',
                                objectFit: 'cover',
                            }}
                            src={item}
                        />
                    </Box>
                ))}
            </Fade>
        </Box>
    )
}