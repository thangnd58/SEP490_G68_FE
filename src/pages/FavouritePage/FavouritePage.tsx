import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Chip, FormControl, Paper, Select, Typography, styled } from '@mui/material';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme'
import useThemePage from '../../hooks/useThemePage';
import { Image } from '@mui/icons-material';



const Wallet = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();

    return (
        <Box display={'flex'} flexDirection={'row'} margin={'32px auto'} borderRadius={'8px'} justifyContent={'center'}>
            <Paper elevation={2} sx={{ width: isMobile ? '90%' : '70%' }}>
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
                    <Box display={'flex'}  flexDirection={"row"} flexWrap={'wrap'} justifyContent={'space-around'} >
                        <Box marginTop={'30px'} height={'250px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'} display={'flex'} >
                            
                            {/* Image*/}
                            <Box display={'flex'} width={"50%"} justifyContent={'center'} alignItems={'center'}>
                                <img style={{ borderRadius: '10px', width : '260px' , height : '200px'}} src='https://vcdn-vnexpress.vnecdn.net/2022/07/05/Wave-Den-6379-1657000031.jpg'/>
                            </Box>

                            {/* Content*/}
                            <Box width={"50%"} display={'flex'} flexDirection={"row"} justifyContent={'flex-start'}>
                                {/* Chip*/}
                                <Box display={'flex'} marginTop={'20px'}>
                                    <Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "12px" },height: '27px', fontWeight : 'bold'}}
                                        color="success"
                                        label='Xe Tay Ga' />
                                    <Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "12px" },height: '27px', marginLeft : '7px', fontWeight : 'bold'}}
                                        color="warning"
                                        label={t('favourite.item.ship')} />
                                </Box>
                            </Box>
                        </Box>  
                        <Box marginTop={'30px'} height={'250px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'250px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>     
                        <Box marginTop={'30px'} height={'250px'} width={'43%'} border={'1px black solid'} borderRadius={'5px'}></Box>              
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Wallet;