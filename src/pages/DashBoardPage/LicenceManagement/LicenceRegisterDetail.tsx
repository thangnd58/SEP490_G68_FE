import { Box, Button, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LicenceManagementService from "../../../services/LicenceManagementService";
import { Lisence } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";

const LicenceRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const navigate = useNavigate()
    const [licence, setLicence] = useState<Lisence>();
    useEffect(() => {
        getLicenseById(Number(id))
    }, [id])

    const getLicenseById = async (id: number) => {
        try {
            const response = await LicenceManagementService.getLicenceById(id);
            if (response) {
                setLicence(response)
            }
        } catch (error) {

        }
    }
    const changeStatus = async (status: number) => {
        try {
            const response = await LicenceManagementService.changeStatus(Number(id),Number(status),"")
            if (response.status === 200) {
                if(status == 1){
                    ToastComponent(t("toast.dashboardLicense.Arrprove.success"), "success");
                }else {
                    ToastComponent(t("toast.dashboardLicense.Reject.success"), "success");
                }
                
            } else {
                if(status == 1){
                    ToastComponent(t("toast.dashboardLicense.Arrprove.warning"), "warning");
                }else {
                    ToastComponent(t("toast.dashboardLicense.Reject.success"), "success");
                }
            }
        } catch (error) {
            if(status == 1){
                ToastComponent(t("toast.dashboardLicense.Arrprove.error"), "error");
            }else{
                ToastComponent(t("toast.dashboardLicense.Reject.error"), "error");
            }
            
        }
        
      };

    return (
        <Box sx={{ display: 'flex', height: '88vh', marginTop: '2rem' }}>
            <Box flex={1} width={'50%'} marginLeft={2} borderRadius={5} sx={{ background: 'linear-gradient(#8B4513, White)' }} display={'grid'} gridTemplateColumns={'1fr'}>
                <Typography color={'white'} marginTop={3} marginLeft={3} fontSize={29} fontWeight={'bold'}>{t("dashBoardManager.License")}</Typography>
                <Box display={'flex'} justifyContent={'center'} >
                    <Box height="260px" width="510px" display={'flex'} sx={{ backgroundColor: 'White' }} justifyContent={'center'} alignItems={'center'}>
                        <img height="250px" width="500px" src={licence?.licenceImageUrl} alt={'licence'} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', mx: '1rem', gap: '3rem', width: '50%', position: 'relative' }} >
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginRight: 1 }} align="right" fontWeight={'bold'}>{t("licenseInfo.NumberLicense")} :</Typography>
                    <Typography variant="h5" align="left">{licence?.licenceNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("licenseInfo.Name")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">{licence?.fullName}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("userProfile.DOB")} : </Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">{licence?.dob}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button key={'changePass'} variant="contained" onClick={() => changeStatus(1)}>{t("licenseInfo.BtnApprove")}</Button>
                    <Button key={'changePass'} variant="outlined" onClick={() => changeStatus(2)}>{t("licenseInfo.BtnReject")}</Button>
                </Box>
                <MyCustomButton key={'changePass'} height="auto" onClick={() => navigate(-1)} content={t("changePassword.Back")} />
            </Box>
        </Box>
    )
}

export default LicenceRegisterDetail;