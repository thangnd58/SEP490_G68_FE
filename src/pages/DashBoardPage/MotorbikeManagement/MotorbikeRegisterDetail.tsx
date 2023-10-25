
import { Box, Button, Typography,TextareaAutosize } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MotorbikeManagementService from "../../../services/MotorbikeManagementService";
import { Motorbike } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useFormik } from "formik";

const MotorbikeRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const [statusChange, setStatusChange] = useState<Number>();
    const navigate = useNavigate()
    const [motorbike, setMotorbike] = useState<Motorbike>();
    useEffect(() => {
        getMotobikeById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            statusComment: ""
        },
        onSubmit: values => {
            changeStatus(Number(statusChange),values.statusComment);
        }
    });

    const {
        values,
        handleChange,
        handleSubmit,
      } = formik;

    const getMotobikeById = async (id: number) => {
        try {
            const response = await MotorbikeManagementService.getMotorbikesById(id);
            if (response) {
                setMotorbike(response)
            }
        } catch (error) {

        }
    }

    const changeStatus = async (status: number, statusComment : string) => {
        try {
            const response = await MotorbikeManagementService.changeStatus(Number(id),status,statusComment)
            if (response.status === 200) {
                if(status == 1){
                    navigate(-1);
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.success"), "success");
                }else {
                    navigate(-1);
                    ToastComponent(t("toast.dashboardMotorbike.Reject.success"), "success");
                }
                
            } else {
                if(status == 1){
                    ToastComponent(t("toast.dashboardMotorbike.Arrprove.warning"), "warning");
                }else {
                    ToastComponent(t("toast.dashboardMotorbike.Reject.warning"), "warning");
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width:'100%' }}>
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
                    <Button variant="contained" type="submit" onClick={() =>  setStatusChange(1)}>{t("licenseInfo.BtnApprove")}</Button>
                    <Button variant="outlined" type="submit" onClick={() => setStatusChange(2)}>{t("licenseInfo.BtnReject")}</Button>
                </Box>
                <TextareaAutosize
                        name="statusComment"
                        aria-label={t("licenseInfo.InputComment")}
                        minRows={3}
                        onChange={handleChange}
                        value={values.statusComment}
                        placeholder={t("licenseInfo.InputComment")}
                        style={{
                            paddingTop : '10px',
                            borderRadius : '10px',
                            fontFamily: 'Arial, sans-serif',
                            fontSize : '16px'
                        }}
                    />
                <MyCustomButton height="auto" onClick={() => navigate(-1)} content={t("changePassword.Back")} />
            </form>
            </Box>
        </Box>
    )
}

export default MotorbikeRegisterDetail;