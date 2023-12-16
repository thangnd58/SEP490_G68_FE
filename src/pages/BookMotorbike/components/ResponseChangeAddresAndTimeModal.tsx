import { Box, Modal, TextField, Typography } from "@mui/material";
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

function ResponseChangeAddresAndTimeModal(props: {
  booking: Booking;
  setReload: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const { setContentModal } = useContext(ModalContext);
  const { booking, setReload } = props;

  const formik = useFormik({
    initialValues: {
      returnStatusComment: booking.returnStatusComment || "",
    },
    onSubmit: async (values) => {},
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
      setContentModal(<></>);
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
      setContentModal(<></>);
    }
  };

  return (
    <Modal
      open={true}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        zIndex: 10000,
      }}
    >
      <Box
        width={isMobile ? "70%" : "50%"}
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
              onClick={() => setContentModal(<></>)}
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
                  SelectProps={{
                    native: true,
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
                  SelectProps={{
                    native: true,
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
                  SelectProps={{
                    native: true,
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
                  SelectProps={{
                    native: true,
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
              content={t("ChangePhone.BtnConfirm")}
              onClick={handleApproved}
            />
            <MyCustomButton
              content={t("licenseInfo.Reject")}
              onClick={handleRejected}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ResponseChangeAddresAndTimeModal;
