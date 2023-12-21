import { Box, Checkbox, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../../../utils/theme";
import usei18next from "../../../hooks/usei18next";
import useThemePage from "../../../hooks/useThemePage";
import MyIcon from "../../../components/common/MyIcon";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { formatMoney } from "../../../utils/helper";
import { MoneyFlow } from "../../../utils/type";
import StatisticService from "../../../services/StatisticService";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { MoneyFlowType } from "../../../utils/Constant";

export default function TotalMoneyOutDetail() {
  const { t, isVn } = usei18next();
  const { isMobile } = useThemePage();
  const navigate = useNavigate();
  const today = dayjs();
  const sevenDaysBefore = today.subtract(7, "day");
  const [moneyFlow, setMoneyFlow] = useState<MoneyFlow[]>([]);
  const formik = useFormik({
    initialValues: {
      startDate: sevenDaysBefore.format("YYYY-MM-DD"),
      endDate: today.format("YYYY-MM-DD"),
    },
    onSubmit: async (values, actions) => {},
  });
  const { values, setFieldValue } = formik;
  const [getAllData, setGetAllData] = useState<boolean>(false);
  useEffect(() => {
    StatisticService.moneyFlow(
      values.startDate,
      values.endDate,
      getAllData
    ).then((data) => {
      setMoneyFlow(
        data.filter(
          (d) =>
            d.moneyOut !== null &&
            (d.description === MoneyFlowType.ToWithdraw ||
              d.description === MoneyFlowType.RefundWhenCancelBooking ||
              d.description === MoneyFlowType.ToPayDepositForMotorbikeOwner)
        )
      );
    });
  }, [values.endDate, values.startDate, getAllData]);
  const columnsDeposite = [
    {
      field: "id",
      headerName: t("wallet.title_transaction_code"),
      flex: 1,
      renderCell: (params: any) => <Box>{`TRANSACTION${params.value}`}</Box>,
    },
    {
      field: "createDate",
      headerName: t("wallet.title_request_date"),
      flex: 1,
      renderCell: (params: any) => (
        <Box>{new Date(params.value).toLocaleString()}</Box>
      ),
    },
    {
      field: "moneyOut",
      headerName: t("wallet.title_amount"),
      flex: 1,
      renderCell: (params: any) => (
        <Box>- {formatMoney(params.value || 0)}</Box>
      ),
    },
    {
      field: "type",
      headerName: t("wallet.title_type_payment"),
      flex: 1,
      renderCell: (params: any) => <Box>{params.value}</Box>,
    },
    {
      field: "description",
      headerName: t("postMotorbike.listform.description"),
      flex: 1,
      renderCell: (params: any) => <Box>{params.value}</Box>,
    },
  ];

  const { RangePicker } = DatePicker;

  return (
    <Box height={"700px"}>
      <Box sx={{ backgroundColor: "#8B4513" }} display={"flex"} gap={"4px"}>
        <MyIcon
          noPadding
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
          pb={2}
        >
          {t("dashBoardManager.dashboard.moneyOut")}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "4px",
          display: "flex",
          alignItems: "start",
          p: "8px",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Box display={"flex"} gap={"4px"} alignItems={"center"}>
          <RangePicker
            className="custom-range-picker custom-table"
            style={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontSize: "20px",
              height: isMobile ? "32px" : "auto",
              color: "#666666",
            }}
            size={isMobile ? "middle" : "large"}
            format="YYYY-MM-DD"
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            value={[
              dayjs(values.startDate, "YYYY-MM-DD"),
              dayjs(values.endDate, "YYYY-MM-DD"),
            ]}
            onChange={(dates, dateStrings) => {
              setFieldValue("startDate", dateStrings[0]);
              setFieldValue("endDate", dateStrings[1]);
            }}
            disabled={getAllData}
            allowClear={false}
          />
          <Checkbox
            onClick={() => setGetAllData(!getAllData)}
            checked={getAllData}
            sx={{
              color: theme.palette.primary.main,
              "&.Mui-checked": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          />
        </Box>
        <DataGrid
          sx={{
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            width: isMobile ? "800px" : "100%",
          }}
          rows={moneyFlow}
          checkboxSelection={false}
          initialState={{
            pagination: { paginationModel: { pageSize: 7 } },
          }}
          pageSizeOptions={[7, 10, 25]}
          columns={columnsDeposite}
          loading={moneyFlow.length === 0}
          rowHeight={48}
          disableRowSelectionOnClick
          pagination
        />
      </Box>
    </Box>
  );
}
