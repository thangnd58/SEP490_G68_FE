import { Avatar, Box, Chip, Collapse, Divider, Tooltip, Typography } from "@mui/material"
import { Motorbike } from "../../../utils/type"
import usei18next from "../../../hooks/usei18next"
import theme from "../../../utils/theme";
import { ArrowDownward, ArrowUpward, BusinessCenterOutlined, StarPurple500Outlined } from "@mui/icons-material";
import { LicencePlateImage, LocationImage, PriceImage } from "../../../assets/images";
import { formatMoneyNew } from "../../../utils/helper";
import { useState } from "react";


export const MotorbikeBookingCard = (props: { motorbike: Motorbike, isMobile: boolean }) => {
    const { t } = usei18next();
    const [expanded, setExpanded] = useState(true);
    console.log(props.motorbike.user)
    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#fff',
                }}
                display={'flex'}
                padding={'8px'}
                border={'1px solid'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'16px'}
                borderRadius={'8px'}
            >
                <Typography
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    fontWeight="500"
                    fontSize={props.isMobile ? 16 : 24}
                    sx={{ cursor: 'pointer' }}
                    color={theme.palette.text.primary}
                >{props.motorbike.model.modelName}</Typography>
                {
                    expanded ? <ArrowUpward sx={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)} /> : <ArrowDownward sx={{ cursor: 'pointer' }} onClick={() => setExpanded(!expanded)} />
                }
            </Box>
            {
                expanded &&
                <Box
                    sx={{
                        backgroundColor: '#fff',
                    }}
                    display={'flex'}
                    padding={'16px'}
                    flexDirection={props.isMobile ? 'column' : 'row'}
                    justifyContent={'space-between'}
                    alignItems={'start'}
                    gap={'16px'}
                >
                    {/* Image */}
                    <Box
                        width={'100%'}
                        sx={{ cursor: 'pointer', position: 'relative' }}
                    >
                        <Avatar
                            src={props.motorbike.imageUrl[0]}
                            sx={{
                                width: '100%',
                                height: '190px',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                            }} alt="image"
                        />
                        {/* User Avatar */}
                        <Tooltip title={props.motorbike.user.name} placement='right-end'>
                            <Avatar sx={{
                                position: 'absolute',
                                bottom: -20,
                                left: 12,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                            }} src={props.motorbike.user.avatarUrl} />
                        </Tooltip>
                    </Box>
                    {/* Content */}
                    <Box
                        width={'100%'}
                        display="flex"
                        flexDirection="column"
                        gap="8px">
                        {/* Brand Name and Model */}
                        <Box display="flex" flexDirection="column" gap="4px">
                            <Box>
                                <Typography
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontWeight="bold"
                                    fontSize="20px"
                                    sx={{ cursor: 'pointer' }}
                                    color={theme.palette.text.primary}
                                >
                                    {props.motorbike.model.modelName}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap="4px">
                                <img src={LocationImage} alt="licence plate" width={30} height={30} />
                                <Typography
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontSize="12px"
                                    fontStyle={"italic"}
                                    color={theme.palette.text.secondary}
                                >
                                    {props.motorbike.address}
                                </Typography>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} gap={'4px'}>
                                <img src={LicencePlateImage} alt="licence plate" width={30} height={30} />
                                <Typography
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontSize="14px"
                                    sx={{ cursor: 'pointer' }}
                                    color={theme.palette.text.primary}
                                >
                                    {props.motorbike.licensePlate}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap="4px">
                                <img src={PriceImage} alt="licence plate" width={30} height={30} />
                                <Typography
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    fontSize="14px"
                                    fontWeight={'bold'}
                                    sx={{ cursor: 'pointer' }}
                                    color={theme.palette.text.primary}
                                >
                                    {`${formatMoneyNew(props.motorbike.priceRent)}/${t("booking.perDay")}`}
                                </Typography>
                            </Box>

                        </Box>
                        {/* Star Rating and Booking Count */}
                        <Box display="flex">
                            <Box width="100%" display="flex" alignItems="end" gap="4px">
                                <StarPurple500Outlined sx={{ color: "#FBC241" }} fontSize="small" />
                                <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                                    4.5
                                </Typography>
                                <BusinessCenterOutlined fontWeight={300} sx={{ color: "#8B4513" }} fontSize="small" />
                                <Typography color={theme.palette.text.secondary} fontSize="12px" align="center" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                                    5 lượt đặt
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            }
        </>
    )
}