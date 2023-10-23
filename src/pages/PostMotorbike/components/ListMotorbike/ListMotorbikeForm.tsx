import { Checkbox, Chip, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, NativeSelect, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles';
import { Box } from '@mui/system'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';


import React, { useEffect, useState } from 'react'
import theme from '../../../../utils/theme';
import { Edit, EditOutlined, VisibilityOutlined, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MyIcon from '../../../../components/common/MyIcon';
import usei18next from '../../../../hooks/usei18next';
import { ROUTES } from '../../../../utils/Constant';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../../utils/type';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { GridToolbar } from '@mui/x-data-grid-pro';

const ListMotorbikeForm = () => {
  const { t } = usei18next();
  const navigate = useNavigate();

  const [defaultListRegisterMotorbike, setDefaultListRegisterMotorbike] = useState<Motorbike[]>([]);
  const [listRegisterMotorbike, setListRegisterMotorbike] = useState<Motorbike[]>([]);

  useEffect(() => {
    getAllMotorbikesRegistered();
  }, [])

  const getAllMotorbikesRegistered = async () => {
    try {
      const response = await PostMotorbikeService.getListRegisterMotorbike();
      if (response) {
        setListRegisterMotorbike(response);
        setDefaultListRegisterMotorbike(response);
      }
    } catch (error) {

    }
  }

  const uniqueStatus = [...new Set(listRegisterMotorbike.map(item => item.status))];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  // change the list Register Motorbike when change status
  useEffect(() => {
    if (selectedStatus === "All") {
      setListRegisterMotorbike(defaultListRegisterMotorbike);
    } else {
      const newList = listRegisterMotorbike.filter(item => item.motorbikeName === "string");
      setListRegisterMotorbike(newList);
    }
  }, [selectedStatus])

  const columns = [

    { field: 'image', headerName: t("postMotorbike.listform.table-cell-image"), width: 300 },
    { field: 'motorbikeName', headerName: t("postMotorbike.listform.table-cell-model"), width: 125 },
    { field: 'licensePlate', headerName: t("postMotorbike.listform.table-cell-plate"), width: 150 },
    {
      field: 'createDatetime', headerName: t("postMotorbike.listform.table-cell-registerdate"), width: 200,
      renderCell: (params: any) => (
        <Box>
          {new Date(params.value).toLocaleString()}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t("postMotorbike.listform.table-cell-status"),
      width: 150,
      renderCell: (params: any) => (
        params.value === 0 ? (
          <Chip
            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
            color="warning"
            icon={<WarningAmber />}
            label={t('licenseInfo.Processing')} />)
          : params.value === 1 ? (
            <Chip
              sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
              color="success"
              label={t('licenseInfo.Verified')} />) : (
            <Chip
              sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
              color="error"
              label={t('licenseInfo.Cancelled')} />)
      ),
    },
    {
      field: 'id', headerName: t("postMotorbike.listform.table-cell-action"), width: 100,
      renderCell: (params: any) => (
        <MyIcon icon={<EditOutlined />} hasTooltip tooltipText={t("postMotorbike.listform.badge-edit")} onClick={() => navigate(`${ROUTES.user.updateregistermotorbike}/${params.value}`)} position='right' />
      ),
    },
  ];

  return (
    <Box width={"95%"} margin={"32px auto"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignContent={"flex-end"}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
        <Typography fontSize={"18px"} fontWeight={"400"}
          margin={"auto 8px"}>{t("postMotorbike.listform.status")}</Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedStatus}
            native
            displayEmpty
            onChange={handleChangeStatus}
          >
            <option value={"All"}>
              <em>{t("postMotorbike.listform.all")}</em>
            </option>
            {uniqueStatus.map((status) => (
              <option value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box >
        <Box sx={{ borderRadius: "8px" }}>
          <DataGrid
            sx={{
              borderRadius: "8px",
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#8B4513",
              },
              '& .MuiDataGrid-columnHeaderTitle ': {
                color: "#fff",
              },
            }}
            rows={listRegisterMotorbike}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            columns={columns}
            loading={listRegisterMotorbike.length === 0}
            rowHeight={56}
            disableRowSelectionOnClick
            pagination
          // slots={{ toolbar: GridToolbar }}
          // slotProps={{
          //   toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
          // }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ListMotorbikeForm;
