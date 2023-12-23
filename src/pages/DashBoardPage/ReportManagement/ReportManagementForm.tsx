import { useEffect, useState } from "react";
import { Brand, Model, Report } from "../../../utils/type";
import { useNavigate, useParams } from "react-router-dom";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import { Box, TextField, Typography, Select, MenuItem } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../utils/theme";
import ErrorMessage from "../../../components/common/ErrorMessage";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastComponent from "../../../components/toast/ToastComponent";
import ModelManagementService from "../../../services/ModelManagementService";
import { ReportService } from "../../../services/ReportService";
import { ReportStatus } from "../../../utils/Constant";

const ReportManagementForm = () => {
  const [report, setReport] = useState<Report>();
  const { id } = useParams();
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const navigate = useNavigate();
  const [isSave, setIsSave] = useState<boolean>(false);

  useEffect(() => {
    getReportById(Number(id));
  }, [id]);

  const formik = useFormik({
    initialValues: {
      statusComment: report?.statusComment || "",
    },
    validationSchema: Yup.object({
      statusComment: Yup.string().required(t("form.required")),
    }),
    onSubmit: async (values) => {
      try {
        setIsSave(true);
        await ReportService.responseReport(id!, {
          statusComment: values.statusComment,
        });
        ToastComponent(t("toast.ModelManager.Edit.warning"), "success");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } catch (error) {
        ToastComponent(t("toast.ModelManager.Edit.warning"), "warning");
      }
    },
  });

  const getReportById = async (id: number) => {
    try {
      const response = await ReportService.getReportById(id.toString());
      if (response) {
        setReport(response);
        setFieldValue("statusComment", response.statusComment);
      }
    } catch (error) {}
  };

  const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
    formik;

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
          {t("dashBoardManager.Navigation.report")}
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
          padding: isMobile ? "2rem" : "3rem",
          gap: "3rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "95%",
            justifyContent: "center",
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
                      {t("report.category")}
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
                      {report?.category.categoryName}
                    </Typography>
                  </TableCell>
                </TableRow>

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
                      {t("report.reporter")}
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
                      {report?.reporter.name}
                    </Typography>
                  </TableCell>
                </TableRow>

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
                      {t("dashBoardManager.model.createDate")}
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
                      {new Date(
                        report?.createDatetime || ""
                      ).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
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
                      {t("report.detailReport")}
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
                      <div dangerouslySetInnerHTML={{__html: report?.detail || ""}}>

                      </div>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            name="statusComment"
            onChange={handleChange}
            value={values.statusComment}
            placeholder={t("report.placeholderResponse")}
            label={t("report.placeholderResponse")}
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
              marginTop: "16px",
              fontSize: "16px",
            }}
            InputProps={{
                readOnly: report?.status === ReportStatus.Responded,
            }}
          />

          {report?.status !== ReportStatus.Responded && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                mt: "16px",
              }}
            >
              <MyCustomButton
                type="submit"
                borderRadius={8}
                fontSize={16}
                fontWeight={400}
                disabled={isSave}
                content={t("dashBoardManager.news.buttonSave")}
                onClick={handleSubmit}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default ReportManagementForm;
