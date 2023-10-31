import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Chip, FormControl, Paper, Select, Typography, Button , Tooltip } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme'
import useThemePage from '../../hooks/useThemePage';
import { Image } from '@mui/icons-material';
import PlaceIcon from '@mui/icons-material/Place';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const Wallet = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();

    return (
        <Box display={'flex'} flexDirection={'row'} margin={'32px auto'} borderRadius={'8px'} justifyContent={'center'}>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '80%' }}>
                
                <Box
                    alignContent={'center'}
                    display={"flex"}
                    padding={isMobile ? "16px" : "32px"}
                    flexDirection={"column"}>
                    {/* Title */}
                    <Typography
                        variant='h1'
                        color={theme.palette.text.primary}
                        fontSize={isMobile ? "24px" : "32px"}
                        lineHeight={"40px"}
                        fontWeight={"600"}
                        sx={{ textAlign: 'center' }}>
                        {t("favourite.title")}
                    </Typography>

                    {/* Select sort*/}
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
                        <Typography fontSize={"18px"} fontWeight={"400"}
                        margin={"auto 8px"}>{t("favourite.sort.title")}</Typography>
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={'Ngày'}
                                native
                                displayEmpty
                                // onChange={handleChangeStatus}
                            >
                                <option value={"date"}>
                                <em>{t("favourite.sort.date")}</em>
                                </option>
                                <option value={"price"}>
                                <em>{t("favourite.sort.price")}</em>
                                </option>
                                <option value={"brand"}>
                                <em>{t("favourite.sort.brand")}</em>
                                </option>
                                {/* {setUniqueStatus.map((status) => (
                                <option value={status.key}>
                                    {status.value}
                                </option>
                                ))} */}
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* Item List*/}
                    
                    <Box display={'flex'}  flexDirection={"row"} flexWrap={'wrap'} justifyContent={'space-evenly'} >
                        
                        <Box marginTop={'30px'} height={'270px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'} display={'flex'} >
                            
                            {/* Image*/}
                            <Tooltip title={t("favourite.item.view")}>
                            <Box display={'flex'} width={"55%"} justifyContent={'center'} alignItems={'center'} sx={{cursor:'pointer'}}>
                                <img style={{ borderRadius: '10px', width : '300px' , height : '230px'}} src='https://vcdn-vnexpress.vnecdn.net/2022/07/05/Wave-Den-6379-1657000031.jpg'/>
                            </Box>
                            </Tooltip>
                            {/* Content*/}
                            <Box width={"45%"} display={'flex'} flexDirection={"column"} justifyContent={'flex-start'}>
                                {/* Chip*/}
                                <Box display={'flex'} marginTop={'25px'}>
                                    <Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "12px" },height: '27px', fontWeight : 'bold'}}
                                        color="success"
                                        label='Xe Tay Ga' />
                                    <Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "12px" },height: '27px', marginLeft : '7px', fontWeight : 'bold'}}
                                        color="warning"
                                        label={t('favourite.item.ship')} />
                                </Box>
                               
                                    <Box display={'flex'} sx={{cursor:'pointer'}}>
                                        <Typography fontWeight={'bold'} fontSize={'20px'} marginTop={'8px'} marginLeft={'4px'}>Honda</Typography>
                                        <Tooltip placement='right' title='Wave Alpha Wave Alpha'>
                                            <Typography fontSize={'20px'} marginTop={'8px'} marginLeft={'8px'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>Wave Alpha Wave Alpha</Typography>
                                        </Tooltip>
                                    </Box>
                                
                                <Box display={'flex'}  marginTop={'8px'} borderBottom={'1px #8B4513 solid'} paddingBottom={'8px'}>
                                    <PlaceIcon></PlaceIcon>
                                    <Tooltip placement='right' title='Quận Tây Hồ, Hà Nội, Quận Tây Hồ, Hà NộiQuận Tây Hồ, Hà NộiQuận Tây Hồ, Hà Nội'>
                                        <Typography textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>Quận Tây Hồ, Hà Nội, Quận Tây Hồ, Hà NộiQuận Tây Hồ, Hà NộiQuận Tây Hồ, Hà Nội</Typography>
                                    </Tooltip>
                                </Box>
                                <Box display={'flex'}>
                                    <Box width={"50%"} borderRight={'1px #8B4513 solid'} flexDirection={"column"} justifyContent={'center'} display={'flex'} alignItems={'center'}>
                                        <Box marginTop={'10px'}>
                                            <Avatar src={''} /> 
                                        </Box>
                                        <Box width={"100%"}>
                                        <Typography marginTop={'5px'} fontSize={'13px'} align='center' textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>Nguyễn Xuân Trường Trường Trường Trường</Typography>   
                                        </Box>
                                    </Box>
                                    <Box width={"50%"} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                        <Button variant="contained" color="primary">
                                            {t('favourite.item.unlike')}
                                        </Button>
                                    </Box>
                                </Box>
                                <Box display={'flex'}  marginTop={'10px'} justifyContent={'center'} alignItems={'center'} gap={'5px'}>
                                    <Box display={'flex'}>
                                        <Typography fontWeight={'bold'} fontSize={'19px'}>250.000đ</Typography>
                                        <Typography fontSize={'19px'}>/</Typography>
                                        <Typography paddingTop={'4px'} fontSize={'15px'}> Ngày</Typography>
                                    </Box>
                                    <IconButton
                                        style={{fontSize : '15px' , fontWeight : 'bold'}}
                                        color="primary" // You can use different colors like "primary", "secondary", "default", etc.
                                        onClick={() => {
                                            // Add your action here
                                        }}
                                        >
                                        <KeyboardDoubleArrowRightIcon /> Thêm giỏ hàng
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>  
                        <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'280px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>              

                    </Box>
                </Box>
            </Paper>
            
        </Box>
    );
};

export default Wallet;