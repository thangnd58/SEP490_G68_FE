import {
  Box,
  Button,
  Chip,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import usei18next from "../../../hooks/usei18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Booking, Lisence } from "../../../utils/type";
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
import { BookingService } from "../../../services/BookingService";
import { formatMoneyNew } from "../../../utils/helper";

export const BookingDetail = () => {
  const { t } = usei18next();
  const navigate = useNavigate();
  const { isMobile } = useThemePage();
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const { id } = useParams();

  useEffect(() => {
    getAllBooking();
  }, []);
  const getAllBooking = async () => {
    try {
      const response = await BookingService.getListBooking();
      if (response) {
        setSelectedBooking(response.find((b) => b.bookingId.toString() === id));
      }
    } catch (error) {}
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
          {t("dashBoardManager.Navigation.booking")}
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
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
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
                      Mã đặt
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
                      {selectedBooking?.bookingId}
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
                      Khách thuê
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
                      {selectedBooking?.createUserId}
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
                      Chủ xe
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
                      {selectedBooking?.updateUserId}
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
                      Ngày nhận xe
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
                        selectedBooking?.startDatetime || ""
                      ).toLocaleString()}
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
                      Ngày trả xe
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
                        selectedBooking?.endDatetime || ""
                      ).toLocaleString()}
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
                      Địa chỉ nhận
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
                      {selectedBooking?.address}
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
                      Địa chỉ trả xe
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
                      {selectedBooking?.returnAddress === null
                        ? selectedBooking?.address
                        : selectedBooking?.returnAddress}
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
                      Số ngày thuê
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
                      {selectedBooking?.rentalDays}
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
                      Phí giao xe
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
                      {formatMoneyNew(selectedBooking?.totalFeeOfDelivery)}
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
                      Phí dịch vụ
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
                      {formatMoneyNew(selectedBooking?.feeOfService)}
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
                      Giảm giá
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
                      {formatMoneyNew(selectedBooking?.reducedAmount)}
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
                      Tổng tiền
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
                      {formatMoneyNew(selectedBooking?.totalAmount)}
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
                      Tiền khách cọc
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
                      {formatMoneyNew(selectedBooking?.deposit)}
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
                      {t("wallet.title_type_payment")}
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
                      {selectedBooking?.paymentType === "Card"
                        ? t("dashBoardManager.booking.Card")
                        : t("dashBoardManager.booking.UserBalance")}
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
                      Trạng thái
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
                      {selectedBooking?.status === "PendingReview" ? (
                        <Chip
                          sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                          color="warning"
                          icon={<WarningAmber />}
                          label={t("dashBoardManager.booking.PendingReview")}
                        />
                      ) : selectedBooking?.status === "Finished" ? (
                        <Chip
                          sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                          color="success"
                          icon={<CheckCircleOutline />}
                          label={t("dashBoardManager.booking.Finished")}
                        />
                      ) : (
                        <Chip
                          sx={{ "& .MuiChip-label": { fontSize: "14px" } }}
                          color="error"
                          icon={<ErrorOutline />}
                          label={t("dashBoardManager.booking.Cancelled")}
                        />
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
