
import { Box, Button, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { Motorbike } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";

const MotorbikeRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const navigate = useNavigate()
    const [motorbike, setMotorbike] = useState<Motorbike>();
    useEffect(() => {
        getMotobikeById(Number(id))
    }, [id])

    const getMotobikeById = async (id: number) => {
        try {
            const response = await MotorbikeManagementService.getMotorbikesById(id);
            if (response) {
                setMotorbike(response)
            }
        } catch (error) {

        }
    }

    const changeStatus = async (status: number) => {
        try {
            const response = await MotorbikeManagementService.changeStatus(Number(id),Number(status),"")
            if (response.status === 200) {
                if(status == 1){
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.success"), "success");
                }else {
                    ToastComponent(t("toast.dashboardMotorbike.Reject.success"), "success");
                }
                
            } else {
                if(status == 1){
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.warning"), "warning");
                }else {
                    ToastComponent(t("toast.dashboardMotorbike.Reject.success"), "success");
                }
            }
        } catch (error) {
            if(status == 1){
                ToastComponent(t("toast.dashboardMotorbike.Arrprove.error"), "error");
            }else{
                ToastComponent(t("toast.dashboardMotorbike.Reject.error"), "error");
            }
            
        }
        
      };

    return (
        <Box sx={{ display: 'flex', height: '60vh', marginTop: '7rem', justifyContent: 'space-between', gap: '1rem' }}>
            <Box flex={1} width={'50%'} marginLeft={2} borderRadius={5} sx={{ background: 'linear-gradient(#8B4513, White)' }} display={'grid'} gridTemplateColumns={'1fr'}>
                <Typography color={'white'} marginTop={3} marginLeft={3} fontSize={29} fontWeight={'bold'}>{t("dashBoardManager.Motobike.Title")}</Typography>
                <Box display={'flex'} justifyContent={'center'} >
                    <Box height="80%" width="80%" display={'flex'} sx={{ backgroundColor: 'White' }} justifyContent={'center'} alignItems={'center'}>
                        <img height="250px" width="500px" src={motorbike?.image} alt={'licence'} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem', width:'50%' }} >
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginRight: 1 }} align="right" fontWeight={'bold'}>{t("dashBoardManager.Motobike.Name")} :</Typography>
                    <Typography variant="h5" align="left">{motorbike?.modelName}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 1, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("dashBoardManager.Motobike.Plate")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 1 }} align="left">{motorbike?.licensePlate}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 1, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("dashBoardManager.Motobike.Fuel")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 1 }} align="left">{motorbike?.type}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 1, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("dashBoardManager.Motobike.Location")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 1 }} align="left">{motorbike?.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 1, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("dashBoardManager.Motobike.PriceForRent")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 1 }} align="left">{motorbike?.priceRent}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button key={'changePass'} variant="contained" onClick={() =>  changeStatus(1)}>{t("licenseInfo.BtnApprove")}</Button>
                    <Button key={'changePass'} variant="outlined" onClick={() => changeStatus(2)}>{t("licenseInfo.BtnReject")}</Button>
                </Box>
                <MyCustomButton key={'changePass'} height="auto" onClick={() => navigate(-1)} content={t("changePassword.Back")} />
            </Box>
        </Box>
    )
}

export default MotorbikeRegisterDetail;