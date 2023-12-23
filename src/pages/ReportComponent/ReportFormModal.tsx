import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  InputLabel,
  TextareaAutosize,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Feedback, Motorbike, ReportCategory, ReportRequest } from "../../utils/type";
import { useState, useEffect, useContext } from "react";
import { ROUTES, ReportType } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import MyIcon from "../../components/common/MyIcon";
import { ArrowBack, CloseOutlined } from "@mui/icons-material";
import theme from "../../utils/theme";
import usei18next from "../../hooks/usei18next";
import { PromotionService } from "../../services/PromotionService";
import { Transition } from "../WalletPage/common/Transition";
import { ModalContext } from "../../contexts/ModalContext";
import { LogoHeader } from "../../assets/images";
import { ReportService } from "../../services/ReportService";
import MyCustomTextField from "../../components/common/MyTextField";
import MyCustomButton from "../../components/common/MyButton";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorMessage from "../../components/common/ErrorMessage";
import ToastComponent from "../../components/toast/ToastComponent";

export const ReportFormModal = (props: {
  bookingId?: number;
  type: string;
  motorbike?: Motorbike;
  feedback?: Feedback;
}) => {
  const { bookingId, type, motorbike, feedback } = props;
  const [reportCategories, setReportCategories] = useState<ReportCategory[]>(
    []
  );
  const { t } = usei18next();
  const { closeModal } = useContext(ModalContext);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>();
  const { isMobile } = useThemePage();
  useEffect(() => {
    try {
      ReportService.getAllReportCategory().then((data) => {
        if (type === ReportType.Booking) {
          setReportCategories(
            data.filter(
              (t) =>
                t.categoryId === 1 || t.categoryId === 2 || t.categoryId === 4
            )
          );
        } else if (type === ReportType.Money) {
          setReportCategories(data.filter((t) => t.categoryId === 3));
        } else {
          setReportCategories(data.filter((t) => t.categoryId === 9));
        }
      });
    } catch (error) {}
  }, []);

  const formik = useFormik({
    initialValues: {
      detail: "",
      categoryDetail: "",
      categoryId: "",
      subDetail: "",
    },
    validationSchema: Yup.object({
      categoryId: Yup.number().required(t("form.required")),
      detail: Yup.string().required(t("form.required")),
    }),
    onSubmit: async (values) => {
      try {
        const req: ReportRequest = {
          categoryId: Number(values.categoryId),
          detail: `${values.subDetail}${values.detail}`,
        };
        await ReportService.postReport(req);
        ToastComponent(t("report.reportSuccess"), "success");
        closeModal();
      } catch (error) {}
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  useEffect(() => {
    if (type === ReportType.Booking) {
      setFieldValue(
        "categoryDetail", `${motorbike?.model.brand.brandName} ${motorbike?.model.modelName}`
      );
      setFieldValue("subDetail", `<a href="https://wandro.io.vn/manage-booking/${bookingId}" target="_blank">[bookingId: ${bookingId}, motorbikeId: ${motorbike?.id}]:</a>`)
    } else if (type === ReportType.Feedback) {
      setFieldValue("categoryDetail", `${feedback?.comment}`);
      setFieldValue("subDetail", `[feedbackId: ${feedback?.feedbackId}]: `)
    }
  }, [values.categoryId]);

  return (
    <>
      <Dialog
        open={true}
        onClose={closeModal}
        TransitionComponent={Transition}
        fullWidth
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: isMobile ? "8px" : "1rem 1.5rem",
          },
        }}
      >
        <Box
          height={"10%"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img
            style={{ cursor: "pointer" }}
            alt="logo"
            src={LogoHeader}
            width={"150px"}
          />
          <MyIcon
            icon={<CloseOutlined />}
            hasTooltip
            tooltipText={t("postMotorbike.registedForm.badge-close")}
            onClick={closeModal}
            position="bottom"
          />
        </Box>
        <DialogTitle
          sx={{
            padding: "16px",
          }}
        >
          <Box
            width={"100%"}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Typography fontWeight={"700"} fontSize={"24px"}>
              {t("report.reason")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            margin: isMobile ? "0px" : "0px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            mb: "16px",
            // alignItems: 'center',
            // borderRadius: '16px',
            // border: '1px solid #E0E0E0',
          }}
        >
          <Autocomplete
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                },
                "&:hover fieldset": {
                  border: "1px solid #8B4513",
                },
                "&.Mui-focused fieldset": {
                  border: "2px solid #8B4513",
                },
              },
            }}
            disablePortal
            options={reportCategories}
            getOptionLabel={(rp) => `${rp.categoryName}`}
            value={selectedCategory}
            onChange={(event, newValue) => {
              setSelectedCategory(newValue || undefined);
              setFieldValue("categoryId", newValue?.categoryId);
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label={t("report.reason")}
                sx={{ mt: "8px" }}
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: 250,
              },
            }}
          />
          {errors.categoryId && touched.categoryId && (
            <ErrorMessage message={errors.categoryId} />
          )}
          {
            type !== ReportType.Money
            && 
            <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                },
                "&:hover fieldset": {
                  border: "1px solid #8B4513",
                },
                "&.Mui-focused fieldset": {
                  border: "2px solid #8B4513",
                },
              },
            }}
            name="categoryDetail"
            value={values.categoryDetail}
            placeholder={t("report.detailReport")}
            InputProps={{
              readOnly: true
            }}
          />
          }
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                },
                "&:hover fieldset": {
                  border: "1px solid #8B4513",
                },
                "&.Mui-focused fieldset": {
                  border: "2px solid #8B4513",
                },
              },
            }}
            onChange={handleChange}
            multiline={true}
            minRows={5}
            name="detail"
            value={values.detail}
            placeholder={t("report.detailReport")}
          />
          {errors.detail && touched.detail && (
            <ErrorMessage message={errors.detail} />
          )}
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <MyCustomButton
            width="40%"
            variant="outlined"
            content={t("licenseInfo.BtnCancel")}
            onClick={() => closeModal()}
          />
          <MyCustomButton
            width="40%"
            content={t("VerifyPhone.BtnConfirm")}
            onClick={() => handleSubmit()}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
