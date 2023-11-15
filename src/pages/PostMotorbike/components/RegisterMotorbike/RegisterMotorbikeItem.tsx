import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import theme from '../../../../utils/theme';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import MyIcon from '../../../../components/common/MyIcon';
import usei18next from '../../../../hooks/usei18next';
import styled from '@emotion/styled';

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
    moreInfo?: boolean,
}

interface AnimatedBoxProps {
    isOpen: boolean;
}

const AnimatedBox = styled(Box) <AnimatedBoxProps>`
    transition: all 0.3s ease;
    overflow: hidden;
    height: ${(props) => (props.isOpen ? 'auto' : '0')};
    opacity: ${(props) => (props.isOpen ? '1' : '0')};
  `;

const RegisterMotorbikeItem: React.FC<CustomItemProps> = ({ className, title, marginBottomTitle, fontSizeTitle, fontWeightTitle, secondTitle, fontSizeSecondTitle, fontWeightSecondTitle, isRequired, item, myButton, buttonPosition, moreInfo }) => {
    const [open, setOpen] = React.useState(moreInfo ? false : true);
    const { t } = usei18next();
    return (
        <Box className={className} width={"100%"} display={"flex"} flexDirection={"column"} gap={"8px"} margin={"16px 0px"}>
            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Typography
                    variant='h2'
                    color={theme.palette.text.primary}
                    fontSize={fontSizeTitle ? fontSizeTitle : "24px"}
                    fontWeight={fontWeightTitle ? fontWeightTitle : 600}
                    marginBottom={marginBottomTitle ? marginBottomTitle : "8px"}
                    textAlign={"start"}>
                    {title}
                    {isRequired && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                {moreInfo &&
                    <MyIcon
                        icon={
                            open ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                        }
                        position='bottom'
                        hasTooltip
                        tooltipText={t("postMotorbike.registedForm.moreInfor")}
                        onClick={() => {
                            setOpen(!open);
                        }} />
                }
            </Box>
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
            <AnimatedBox isOpen={open}>
                {item}
            </AnimatedBox>
            {myButton &&
                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={buttonPosition ? buttonPosition : "start"}>
                    {myButton}
                </Box>
            }
        </Box>
    );
};

export default RegisterMotorbikeItem;
