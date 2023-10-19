import { Box, Typography } from '@mui/material';
import React from 'react';
import theme from '../../../../utils/theme';

interface CustomItemProps {
    className?: string,
    title: string,
    marginBottomTitle?: string,
    fontSizeTitle?: string,
    fontWeightTitle?: number,
    secondTitle?: string,
    fontSizeSecondTitle?: string,
    fontWeightSecondTitle?: number,
    isRequired: boolean,
    item: React.ReactNode,
    myButton?: React.ReactNode,
    buttonPosition?: 'start' | 'end',
}

const RegisterMotorbikeItem: React.FC<CustomItemProps> = ({ className, title, marginBottomTitle, fontSizeTitle, fontWeightTitle, secondTitle, fontSizeSecondTitle, fontWeightSecondTitle, isRequired, item, myButton, buttonPosition }) => {
    return (
        <Box className={className} width={"100%"} display={"flex"} flexDirection={"column"} gap={"8px"} margin={"16px 0px"}>
            <Typography
                width={"100%"}
                variant='h2'
                color={theme.palette.text.primary}
                fontSize={fontSizeTitle ? fontSizeTitle : "24px"}
                fontWeight={fontWeightTitle ? fontWeightTitle : 600}
                marginBottom={marginBottomTitle ? marginBottomTitle : "8px"}
                textAlign={"start"}>
                {title}
                {isRequired && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            {secondTitle && <Typography
                width={"100%"}
                variant='h3'
                color={theme.palette.text.secondary}
                fontSize={fontSizeSecondTitle ? fontSizeSecondTitle : "16px"}
                fontWeight={fontWeightSecondTitle ? fontWeightSecondTitle : 400}
                sx={{ wordWrap: 'break-word' }}
                textAlign={"start"}>

                {secondTitle}
            </Typography>}
            <Box width={"100%"}>{item}</Box>
            {myButton &&
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={buttonPosition ? buttonPosition : "start"}>
                    {myButton}
                </Box>
            }
        </Box>
    );
};

export default RegisterMotorbikeItem;
