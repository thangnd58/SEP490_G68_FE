import { Box, Button, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LicenceManagementService from "../../../services/LicenceManagementService";
import { Lisence } from "../../../utils/type";

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

    return (
        <Box className="licence-detail-container" display={'flex'} flex-flexDirection={'column'}>
            <Box height={700} className="image-licence-box" flex={1} marginTop={4} marginLeft={2} borderRadius={5} sx={{ background: 'linear-gradient(#8B4513, White)' }} display={'grid'} gridTemplateColumns={'1fr'}>
                <Typography color={'white'} marginTop={3} marginLeft={3} fontSize={29} fontWeight={'bold'}>Licence</Typography>
                <Box width={'100%'} display={'flex'} justifyContent={'center'} >
                    <Box height="260px" width="510px" display={'flex'} sx={{ backgroundColor: 'White' }} justifyContent={'center'} alignItems={'center'}>
                        <img height="250px" width="500px" src={licence?.licenceImageUrl} alt={'licence'} />
                    </Box>
                </Box>

            </Box>
            <Box className="information-licence-box" flex={1} display={'grid'} gridTemplateColumns={'1fr 1fr'} gridTemplateRows={'130px 200px 100px'}>
                <Box gridColumn={'1/3'} marginTop={3}  >
                    <Button variant="outlined" key={'changePass'} sx={{ float: 'right', marginRight: 2 }} onClick={() => navigate(-1)}>{t("changePassword.Back")}</Button>
                </Box>
                <Box >
                    <Typography variant="h5" sx={{ color: 'Black', marginRight: 1 }} align="right" fontWeight={'bold'}>{t("licenseInfo.NumberLicense")} :</Typography>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("licenseInfo.Name")} : </Typography>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3, marginRight: 1 }} align="right" fontWeight={'bold'}>{t("userProfile.DOB")} : </Typography>
                </Box>
                <Box >
                    <Typography variant="h5" align="left">{licence?.licenceNumber}</Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">{licence?.fullName}</Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">{licence?.dob}</Typography>
                </Box>
                <Box gridColumn={'1/3'} display={'flex'} justifyContent={'center'} alignItems={'center'} columnGap={'70px'}>
                    <Button variant="contained" key={'changePass'} sx={{ height: '50px', fontWeight: 'bold' }}>{t("licenseInfo.Approve")}</Button>
                    <Button variant="outlined" color="error" key={'changePass'} sx={{ height: '50px', fontWeight: 'bold' }}>{t("licenseInfo.Reject")}</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default LicenceRegisterDetail;