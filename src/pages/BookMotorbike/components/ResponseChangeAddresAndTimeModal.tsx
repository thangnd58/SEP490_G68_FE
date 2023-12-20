import { Box, Dialog, Modal, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useContext } from "react";
import useThemePage from "../../../hooks/useThemePage";
import usei18next from "../../../hooks/usei18next";
import theme from "../../../utils/theme";
import MyIcon from "../../../components/common/MyIcon";
import { CloseOutlined } from "@mui/icons-material";
import { ModalContext } from "../../../contexts/ModalContext";
import { Booking } from "../../../utils/type";
import RegisterMotorbikeItem from "../../PostMotorbike/components/RegisterMotorbike/RegisterMotorbikeItem";
import dayjs from "dayjs";
import MyCustomButton from "../../../components/common/MyButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BookingService } from "../../../services/BookingService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { Transition } from "../../WalletPage/common/Transition";

function ResponseChangeAddresAndTimeModal(props: {
  booking: Booking;
  setReload: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const { closeModal } = useContext(ModalContext);
  const { booking, setReload } = props;

  const formik = useFormik({
    initialValues: {
      returnStatusComment: booking.returnStatusComment || "",
    },
    onSubmit: async (values) => { },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const handleApproved = async () => {
    try {
      BookingService.updateStatusReturn(booking.bookingId, {
        returnStatus: "Approved",
        returnStatusComment: values.returnStatusComment,
      }).then((ressult) => {
        ToastComponent(t("booking.toastResultSuccessReply"), "success");
        setReload((prev) => !prev);
      });
    } catch (error) {
      ToastComponent(t("booking.toastResultErrorReply"), "error");
    } finally {
      closeModal();
    }
  };

  const handleRejected = async () => {
    try {
      BookingService.updateStatusReturn(booking.bookingId, {
        returnStatus: "Rejected",
        returnStatusComment: values.returnStatusComment,
      }).then((ressult) => {
        ToastComponent(t("booking.toastResultSuccessReply"), "success");
        setReload((prev) => !prev);
      });
    } catch (error) {
      ToastComponent(t("booking.toastResultErrorReply"), "error");
    } finally {
      closeModal();
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => closeModal()}
      TransitionComponent={Transition}
      fullWidth
      PaperProps={{
        className: "hiddenSroll",
        sx: {
          borderRadius: "16px",
          padding: '16px',
          margin: isMobile ? '0px' : '32px',
          maxWidth: isMobile ? '95%' : '50%',
        }
      }}
    >
      <Box
        height={"auto"}
        sx={{
          padding: "16px 32px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <Box
          width={"100%"}
          height={"10%"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant="h2"
            color={theme.palette.text.primary}
            fontSize={isMobile ? "20px" : "24px"}
            fontWeight={600}
            textAlign={"start"}
          >
            {t("postMotorbike.registedForm.verifyReturnInfo")}
          </Typography>
          <Box
            height={"10%"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <MyIcon
              icon={<CloseOutlined />}
              hasTooltip
              tooltipText={t("postMotorbike.registedForm.badge-close")}
              onClick={() => closeModal()}
              position="bottom"
            />
          </Box>
        </Box>
        <Box
          width={"100%"}
          height={"80%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <RegisterMotorbikeItem
            isRequired={false}
            fontSizeTitle="16px"
            title={t("booking.endDate")}
            item={
              <Box>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderRadius: "8px",
                    },
                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  placeholder={t(
                    "component.MyMapWithSearchBox.searchPlaceholder"
                  )}
                  fullWidth
                  value={dayjs(booking.endDatetime).format("DD-MM-YYYY HH:mm")}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Box>
            }
          />
          <RegisterMotorbikeItem
            isRequired={false}
            fontSizeTitle="16px"
            title={t("booking.returnDate")}
            item={
              <Box>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderRadius: "8px",
                    },
                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  placeholder={t(
                    "component.MyMapWithSearchBox.searchPlaceholder"
                  )}
                  fullWidth
                  value={dayjs(booking.returnDatetime).format(
                    "DD-MM-YYYY HH:mm"
                  )}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Box>
            }
          />
          <RegisterMotorbikeItem
            isRequired={false}
            fontSizeTitle="16px"
            title={t("booking.oldReturnAddress")}
            item={
              <Box>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderRadius: "8px",
                    },
                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  placeholder={t(
                    "component.MyMapWithSearchBox.searchPlaceholder"
                  )}
                  fullWidth
                  value={booking.address}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Box>
            }
          />
          <RegisterMotorbikeItem
            isRequired={false}
            fontSizeTitle="16px"
            title={t("booking.newReturnAddress")}
            item={
              <Box>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderRadius: "8px",
                    },
                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  placeholder={t(
                    "component.MyMapWithSearchBox.searchPlaceholder"
                  )}
                  fullWidth
                  value={booking.returnAddress}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Box>
            }
          />
          <RegisterMotorbikeItem
            isRequired={false}
            fontSizeTitle="16px"
            title={t("booking.confirmNote")}
            item={
              <Box>
                <TextField
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root fieldset": {
                      borderRadius: "8px",
                    },
                    "& .MuiOutlinedInput-root:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  placeholder={t(
                    "component.MyMapWithSearchBox.searchPlaceholder"
                  )}
                  fullWidth
                  name="returnStatusComment"
                  value={values.returnStatusComment}
                  SelectProps={{
                    native: true,
                  }}
                  onChange={handleChange}
                />
              </Box>
            }
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <MyCustomButton
              variant="outlined"
              content={t("licenseInfo.Reject")}
              onClick={handleRejected}
            />
            <MyCustomButton
              content={t("ChangePhone.BtnConfirm")}
              onClick={handleApproved}
            />
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default ResponseChangeAddresAndTimeModal;
