import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
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
import {
  ArrowBack,
  CheckCircleOutline,
  ErrorOutline,
  WarningAmber,
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const LicenceRegisterDetail = () => {
  const { t } = usei18next();
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusChange, setStatusChange] = useState<Number>();
  const [licence, setLicence] = useState<Lisence>();
  const { isMobile, isIpad } = useThemePage();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isRotate, setIsRotate] = useState<boolean>(false);

  useEffect(() => {
    getLicenseById(Number(id));
  }, [id]);

  const formik = useFormik({
    initialValues: {
      statusComment: "",
    },
    onSubmit: (values) => {
      changeStatus(Number(statusChange), values.statusComment);
    },
  });

  const [loading, setLoading] = useState<boolean>(true);

  const getLicenseById = async (id: number) => {
    try {
      const response = await LicenceManagementService.getLicenceById(id);
      if (response) {
        setLicence(response);
        setImagePreviewUrl(response.licenceImageUrl);
        formik.setFieldValue("statusComment", response.statusComment);
        setLoading(false);
      }
    } catch (error) { }
  };

  const changeStatus = async (status: number, statusComment: string) => {
    try {
      const response = await LicenceManagementService.changeStatus(
        Number(id),
        status,
        statusComment
      );
      if (response.status === 200) {
        if (status == 1) {
          navigate(-1);
          ToastComponent(
            t("toast.dashboardLicense.Arrprove.success"),
            "success"
          );
        } else {
          navigate(-1);
          ToastComponent(t("toast.dashboardLicense.Reject.success"), "success");
        }
      } else {
        if (status == 1) {
          ToastComponent(
            t("toast.dashboardLicense.Arrprove.warning"),
            "warning"
          );
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

  const { values, handleChange, handleSubmit } = formik;

  const [statusDriverLicene, setStatusDriverLicence] = useState<number>(1);
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);

  const verifyDriverLicenceByFPTAI = async (imageUrl: string) => {
    try {
      setLoadingVerify(true);
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch the image");
      }
      const blob = await imageResponse.blob();
      const form = new FormData();
      form.append("image", blob);
      const response = await fetch("https://api.fpt.ai/vision/dlr/vnm", {
        method: "POST",
        headers: {
          "api-key": process.env
            .REACT_APP_FPT_AI_DRIVER_LICENCE_API_KEY as string,
        },
        body: form,
      });
      const data = await response.json();
      setStatusDriverLicence(data.errorCode);

    } catch (error) { }
    finally {
      setLoadingVerify(false);
    }
  };

  return (
    <Box width={"100%"} display={"flex"} flexDirection={"column"} gap={"16px"}>
      <Box
        sx={{ backgroundColor: "#8B4513" }}
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1}
      >
        <MyIcon
          icon={<ArrowBack style={{ color: theme.palette.common.white }} />}
          hasTooltip
          tooltipText={t("postMotorbike.registedForm.badge-back")}
          onClick={() => navigate(-1)}
          position="bottom"
        />
        <Typography
          color={theme.palette.common.white}
          variant="h1"
          fontSize={24}
          fontWeight={700}
        >
          {t("dashBoardManager.Navigation.licenseManager")}
        </Typography>
      </Box>

      <Box
        sx={{
          border: "1px solid #E0E0E0",
          backgroundColor: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignContent: "center",
          justifyContent: "center",
          padding: isMobile ? "16px 0px" : "32px",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: isMobile ? "90%" : "30%",
            alignItems: isMobile ? "center" : "flex-start",
            justifyContent: "center",
            rotate: isRotate ? "-90deg" : "0deg",
          }}
          padding={isMobile ? "0px 16px" : "16px"}
        >
          <img
            style={{
              width: "100%",
              borderRadius: "16px",
              objectFit: "fill",
              border: "3px solid #8B4513",
            }}
            src={imagePreviewUrl}
            alt={"licence"}
          />
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "90%" : "60%",
            gap: "8px",
            padding: isMobile ? "0px 16px" : "16px",
          }}
        >
          <TableContainer
            elevation={0.5}
            component={Paper}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              marginTop: "16px",
            }}
          >
            <Table>
              <TableBody>
                {/* License Number */}
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "Black",
                        fontSize: isMobile ? "16px" : "20px",
                        fontWeight: "600",
                      }}
                    >
                      {t("licenseInfo.NumberLicense")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      fontSize={isMobile ? "16px" : "20px"}
                      fontWeight={400}
                      variant="h5"
                    >
                      {licence?.licenceNumber}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Full Name */}
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "Black",
                        fontSize: isMobile ? "16px" : "20px",
                        fontWeight: "600",
                      }}
                    >
                      {t("licenseInfo.Name")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      fontSize={isMobile ? "16px" : "20px"}
                      fontWeight={400}
                      variant="h5"
                    >
                      {licence?.fullName}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Date of Birth */}
                <TableRow>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "Black",
                        fontSize: isMobile ? "16px" : "20px",
                        fontWeight: "600",
                      }}
                    >
                      {t("userProfile.DOB")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #e0e0e0", padding: "8px" }}
                  >
                    <Typography
                      fontSize={isMobile ? "16px" : "20px"}
                      fontWeight={400}
                      variant="h5"
                    >
                      {licence?.dob}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {
            licence?.status === 1 || loading ? null : (

              <Box
                display={licence?.status === 1 ? "none" : "flex"}
                sx={{
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <MyCustomButton
                  content={t("dashBoardManager.licenseManager.buttonVerify")}
                  onClick={() =>
                    verifyDriverLicenceByFPTAI(licence?.licenceImageUrl || "")
                  }
                  disabled={statusDriverLicene === 0 || loadingVerify}
                />
                {
                  loadingVerify && <CircularProgress size={24} />
                }
                {statusDriverLicene === 1 ? (
                  <Chip
                    sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                    color="warning"
                    icon={<WarningAmber />}
                    label={t("dashBoardManager.licenseManager.statusFPTPending")}
                  />
                ) : statusDriverLicene === 0 ? (
                  <Chip
                    sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                    color="success"
                    icon={<CheckCircleOutline />}
                    label={t("dashBoardManager.licenseManager.statusFPTOk")}
                  />
                ) : (
                  <Chip
                    sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                    color="error"
                    icon={<ErrorOutline />}
                    label={t("dashBoardManager.licenseManager.statusFPTInvalid")}
                  />
                )}
              </Box>
            )}
          <form onSubmit={handleSubmit}>
            <TextField
              name="statusComment"
              aria-label={t("licenseInfo.InputComment")}
              minRows={3}
              onChange={handleChange}
              value={values.statusComment}
              placeholder={t("licenseInfo.InputComment")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.action.disabledBackground,
                    borderRadius: "8px",
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                width: "100%",
                paddingTop: "10px",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
              }}
              InputProps={{
                readOnly: licence?.status === 1,
              }}
            />
            {/* Kiểm tra nếu license status khác 1 hoặc đang tải dữ liệu thì không hiện Box */}
            {licence?.status === 1 || loading ? null : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  mt: "16px",
                }}
              >
                <MyCustomButton
                  disabled={statusDriverLicene != 0}
                  type="submit"
                  borderRadius={8}
                  fontSize={16}
                  fontWeight={500}
                  variant={statusDriverLicene == 0 ? "outlined" : "text"}
                  content={t("licenseInfo.BtnReject")}
                  onClick={() => setStatusChange(2)}
                />
                <MyCustomButton
                  disabled={statusDriverLicene != 0}
                  type="submit"
                  borderRadius={8}
                  fontSize={16}
                  fontWeight={400}
                  content={t("licenseInfo.BtnApprove")}
                  onClick={() => setStatusChange(1)}
                />
              </Box>
            )}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LicenceRegisterDetail;
