import { Box, Button, TextField, TextareaAutosize, Typography } from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LicenceManagementService from "../../../services/LicenceManagementService";
import { Lisence } from "../../../utils/type";
import MyCustomButton from "../../../components/common/MyButton";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useFormik } from "formik";
import theme from "../../../utils/theme";
import useThemePage from "../../../hooks/useThemePage";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const LicenceRegisterDetail = () => {
    const { t } = usei18next()
    const { id } = useParams();
    const navigate = useNavigate()
    const [statusChange, setStatusChange] = useState<Number>();
    const [licence, setLicence] = useState<Lisence>();
    const { isMobile, isIpad } = useThemePage();

    useEffect(() => {
        getLicenseById(Number(id))
    }, [id])

    const formik = useFormik({
        initialValues: {
            statusComment: ""
        },
        onSubmit: values => {
            changeStatus(Number(statusChange), values.statusComment);
        }
    });

    const getLicenseById = async (id: number) => {
        try {
            const response = await LicenceManagementService.getLicenceById(id);
            if (response) {
                setLicence(response)
                formik.setFieldValue("statusComment", response.statusComment)
            }
        } catch (error) {

        }
    }

    const changeStatus = async (status: number, statusComment: string) => {
        try {
            const response = await LicenceManagementService.changeStatus(Number(id), status, statusComment)
            if (response.status === 200) {
                if (status == 1) {
                    navigate(-1)
                    ToastComponent(t("toast.dashboardLicense.Arrprove.success"), "success");
                } else {
                    navigate(-1)
                    ToastComponent(t("toast.dashboardLicense.Reject.success"), "success");
                }

            } else {
                if (status == 1) {
                    ToastComponent(t("toast.dashboardLicense.Arrprove.warning"), "warning");
                } else {
                    ToastComponent(t("toast.dashboardLicense.Reject.warning"), "warning");
                }
            }
        } catch (error) {
            if (status == 1) {
                ToastComponent(t("toast.dashboardLicense.Arrprove.error"), "error");
            } else {
                ToastComponent(t("toast.dashboardLicense.Reject.error"), "error");
            }

        }

    };

    const {
        values,
        handleChange,
        handleSubmit,
    } = formik;

    return (
        <Box width={'100%'} display={'flex'} flexDirection={'column'} gap={"16px"}>
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <MyIcon icon={<ArrowBack style={{ color: theme.palette.common.white }} />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => navigate(-1)} position='bottom' />
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.licenseManager")}
                </Typography>
            </Box>

            <Box sx={{
                border: "1px solid #E0E0E0",
                backgroundColor: "#fff",
                borderRadius: "8px",
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignContent: 'center',
                justifyContent: 'center',
                padding: isMobile ? "16px 0px" : "32px",
                gap: '16px',
            }}>
                <Box sx={{ display: 'flex', width: isMobile ? '90%' : '30%', alignItems: isMobile ? 'center' : 'flex-start', justifyContent: 'center' }}
                    padding={isMobile ? "0px 16px" : "16px"}
                >
                    <img
                        style={{
                            width: '100%',
                            borderRadius: '16px',
                            objectFit: 'cover',
                            border: '3px solid #8B4513',
                        }}
                        src={licence?.licenceImageUrl}
                        alt={'licence'} />
                </Box>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: isMobile ? '90%' : '60%',
                        gap: '8px',
                        padding: isMobile ? "0px 16px" : "16px",
                    }}
                >
                    <TableContainer elevation={0.5} component={Paper} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: '16px' }}>
                        <Table>
                            <TableBody>
                                {/* License Number */}
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography variant="h5" sx={{
                                            color: 'Black', fontSize: isMobile ? '16px' : '20px',
                                            fontWeight: '600'
                                        }}>
                                            {t("licenseInfo.NumberLicense")} :
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography fontSize={isMobile ? "16px" : "20px"} fontWeight={400} variant="h5">{licence?.licenceNumber}</Typography>
                                    </TableCell>
                                </TableRow>

                                {/* Full Name */}
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography variant="h5" sx={{
                                            color: 'Black', fontSize: isMobile ? '16px' : '20px',
                                            fontWeight: '600'
                                        }}>
                                            {t("licenseInfo.Name")} :
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography fontSize={isMobile ? "16px" : "20px"} fontWeight={400} variant="h5">{licence?.fullName}</Typography>
                                    </TableCell>
                                </TableRow>

                                {/* Date of Birth */}
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography variant="h5" sx={{
                                            color: 'Black', fontSize: isMobile ? '16px' : '20px',
                                            fontWeight: '600'
                                        }}>
                                            {t("userProfile.DOB")} :
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #e0e0e0', padding: '8px' }}>
                                        <Typography fontSize={isMobile ? "16px" : "20px"} fontWeight={400} variant="h5">{licence?.dob}</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="statusComment"
                            aria-label={t("licenseInfo.InputComment")}
                            minRows={3}
                            onChange={handleChange}
                            value={values.statusComment}
                            placeholder={t("licenseInfo.InputComment")}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.action.disabledBackground,
                                        borderRadius: '8px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                                width: '100%',
                                paddingTop: '10px',
                                fontFamily: 'Arial, sans-serif',
                                fontSize: '16px'
                            }}
                            InputProps={{
                                readOnly: licence?.status === 1,
                            }}
                        />
                        {
                            licence?.status !== 1 &&
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "16px", mt: "16px" }}>
                                <MyCustomButton
                                    type="submit"
                                    borderRadius={8}
                                    fontSize={16}
                                    fontWeight={500}
                                    variant='outlined'
                                    content={t("licenseInfo.BtnReject")}
                                    onClick={() => setStatusChange(2)} />
                                <MyCustomButton
                                    type="submit"
                                    borderRadius={8}
                                    fontSize={16}
                                    fontWeight={400}
                                    content={t("licenseInfo.BtnApprove")}
                                    onClick={() => setStatusChange(1)} />
                            </Box>
                        }
                    </form>
                </Box>

            </Box>
        </Box>
    )
}

export default LicenceRegisterDetail;