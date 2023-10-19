import { Box, Button, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";

const LicenceRegisterDetail = () => {
    const { t } = usei18next()
    return (
        <Box className="licence-detail-container" display={'flex'} flex-flexDirection={'column'}>
            <Box height={700} className="image-licence-box" flex={1} marginTop={4} marginLeft={2} borderRadius={5}  sx={{background: 'linear-gradient(#8B4513, White)'}} display={'grid'} gridTemplateColumns={'1fr'}>
                <Typography  color={'white'} marginTop={3} marginLeft={3} fontSize={29} fontWeight={'bold'}>Licence</Typography>
                <Box width={'100%'} display={'flex'}  justifyContent={'center'} >
                    <Box height="260px" width="510px" display={'flex'} sx={{backgroundColor: 'White'}} justifyContent={'center'} alignItems={'center'}>
                        <img height="250px" width="500px" src="https://sep490g68.s3.ap-southeast-1.amazonaws.com/licence/licenceImage/11/bang_lai%20_xe.png?X-Amz-Expires=300&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAXUMT2MLG3P6VDD57%2F20231018%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231018T201227Z&X-Amz-SignedHeaders=host&X-Amz-Signature=3f61e2923513104cea82811ca78bf44711be6c61cc5f31adfcfc755541bae0c4" alt={'licence'} />
                    </Box>
                </Box>
                
            </Box>
            <Box className="information-licence-box" flex={1} display={'grid'} gridTemplateColumns={'1fr 1fr'} gridTemplateRows={'130px 200px 100px'}>
                <Box gridColumn={'1/3'} marginTop={3}  >
                    <Button variant="outlined"  key={'changePass'} sx={{float :'right', marginRight : 2}}>{t("changePassword.Back")}</Button>
                </Box>
                <Box >
                    <Typography variant="h5" sx={{ color: 'Black' ,marginRight: 1}} align="right" fontWeight={'bold'}>{t("licenseInfo.NumberLicense")} :</Typography>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3 ,marginRight: 1}} align="right" fontWeight={'bold'}>{t("licenseInfo.Name")} : </Typography>
                    <Typography variant="h5" sx={{ color: 'Black', marginTop: 3 ,marginRight: 1}} align="right" fontWeight={'bold'}>{t("userProfile.DOB")} : </Typography>
                </Box>
                <Box >
                    <Typography variant="h5" align="left">123456789111</Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">Nguyen Xuan Truong</Typography>
                    <Typography variant="h5" sx={{ marginTop: 3 }} align="left">19/10/2023</Typography>
                </Box>
                <Box gridColumn={'1/3'} display={'flex'} justifyContent={'center'} alignItems={'center'} columnGap={'70px'}>
                    <Button variant="contained"  key={'changePass'} sx={{height : '50px',fontWeight : 'bold'}}>{t("licenseInfo.Approve")}</Button>
                    <Button variant="outlined" color="error"  key={'changePass'}  sx={{height : '50px',fontWeight : 'bold'}}>{t("licenseInfo.Reject")}</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default LicenceRegisterDetail;