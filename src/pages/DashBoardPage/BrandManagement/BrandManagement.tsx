import { Box, Chip } from "@mui/material";
import { Typography } from "antd";
import theme from '../../../utils/theme';
import usei18next from "../../../hooks/usei18next";
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleOutline, ErrorOutline, WarningAmber } from "@mui/icons-material";
import MyIcon from "../../../components/common/MyIcon";
import EditIcon from '@mui/icons-material/Edit';
import { GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
const BrandManagement = () => {
    const { t } = usei18next();
    const listBrands = 	
    [
      {
        "id": 1,
        "brandName": "Honda",
        "brandImage": "Img"
      },
      {
        "id": 6,
        "brandName": "Yamaha",
        "brandImage": "img"
      },
      {
        "id": 7,
        "brandName": "Suzuki",
        "brandImage": "img"
      },
      {
        "id": 9,
        "brandName": "Kawasaki",
        "brandImage": "img"
      },
      {
        "id": 10,
        "brandName": "Harley-Davidson",
        "brandImage": "img"
      },
      {
        "id": 11,
        "brandName": "Ducati",
        "brandImage": "img"
      },
      {
        "id": 12,
        "brandName": "BMW Motorrad",
        "brandImage": "img"
      },
      {
        "id": 13,
        "brandName": "KTM",
        "brandImage": "img"
      },
      {
        "id": 14,
        "brandName": "Triumph",
        "brandImage": "img"
      },
      {
        "id": 15,
        "brandName": "Vespa",
        "brandImage": "img"
      }
    ];
    const getSelectedRowsToExport = ({
        apiRef,
    }: GridPrintGetRowsToExportParams): GridRowId[] => {
        const selectedRowIds = selectedGridRowsSelector(apiRef);
        if (selectedRowIds.size > 0) {
            return Array.from(selectedRowIds.keys());
        }

        return gridFilteredSortedRowIdsSelector(apiRef);
    };

    const columns = [
        { field: 'brandName', headerName: t("dashBoardManager.brand.brandName"), width: 150 },
        {
            field: 'createDate',
            headerName: t("dashBoardManager.brand.createDate"),
            width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: t("dashBoardManager.brand.status"),
            width: 200,
            renderCell: (params: any) => (

                params.value === 0 ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t("dashBoardManager.licenseManager.statusPending")} />)
                    : params.value === 1 ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("dashBoardManager.licenseManager.statusVerified")} />)
                        :
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("dashBoardManager.licenseManager.statusCancelled")} />)

            ),
        },
        {
            field: 'id',
            headerName: t("dashBoardManager.brand.action"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                    <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} />
                    <MyIcon icon={<DeleteIcon />} position='right' hasTooltip tooltipText={t("dashBoardManager.brand.delete")} />
                </Box>
            )
        },
    ];

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }}>
                <Typography color={theme.palette.common.white}>
                    {t("dashBoardManager.Navigation.brand")}
                </Typography>
            </Box>
            <Box sx={{
                backgroundColor: "#fff",
                borderRadius: "4px"
            }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-virtualScroller': {
                            minHeight: "300px",
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: "none",
                        },
                    }}
                    rows={listBrands}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listBrands.length === 0}
                    rowHeight={48}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    pagination
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
                    }}
                />
            </Box>
        </Box>
    )
}

export default BrandManagement;
