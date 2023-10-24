import { Box } from '@mui/system';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../utils/type';
import React, { useState, useEffect } from 'react';
import MotorbikeManagementService from '../../../services/MotorbikeManagementService';
import { VisibilityOutlined } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import { ROUTES } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { Typography } from '@mui/material';
import theme from '../../../utils/theme';

const MotorbikeManagement = () => {

    const [listMotorbike, setListMotorbike] = useState<Motorbike[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();
    useEffect(() => {
        getAllMotorbikes();
    }, [])

    const getAllMotorbikes = async () => {
        try {
            const response = await MotorbikeManagementService.getAllMotorbikes();
            if (response) {
                setListMotorbike(response)
            }
        } catch (error) {

        }
    }

    const columns = [
        { field: 'motorbikeName', headerName: t("dashBoardManager.motorbikeRentalManager.columnMotorbikeName"), width: 150 },
        { field: 'type', headerName: t("dashBoardManager.motorbikeRentalManager.columnType"), width: 150 },
        { field: 'address', headerName: t("dashBoardManager.motorbikeRentalManager.columnAddress"), width: 150 },
        { field: 'licensePlate', headerName: t("dashBoardManager.motorbikeRentalManager.columnLicensePlate"), width: 150 },
        {
            field: 'createDatetime', headerName: t("dashBoardManager.motorbikeRentalManager.columnCreateDate"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: t("dashBoardManager.motorbikeRentalManager.columnStatus"),
            width: 150,
            renderCell: (params: any) => (
                <Box sx={{ backgroundColor: '#ECFFEE', cursor: 'pointer', width: '100%', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center', color: params.value === 0 ? "warning.main" : params.value === 1 ? "success.main" : "error.main" }}>
                    {
                        params.value === 0 ? t("dashBoardManager.motorbikeRentalManager.statusPending") : params.value === 1 ? t("dashBoardManager.motorbikeRentalManager.statusVerified") : t("dashBoardManager.motorbikeRentalManager.statusCancelled")
                    }
                </Box>
            ),
        },
        {
            field: 'id', headerName: t("dashBoardManager.motorbikeRentalManager.columnAction"), width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }}>
                    <VisibilityOutlined onClick={() => navigate(`${ROUTES.admin.motorbikeregister}/${params.value}`)} />
                </Box>
            )
        },
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

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }}>
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.Navigation.motorbikeRentalManager")}
                </Typography>
            </Box>
            <Box sx={{ backgroundColor: "#fff", borderRadius:"4px" }}>
                <DataGrid
                    rows={listMotorbike}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    
                    pageSizeOptions={[5, 10, 25]}
                    columns={columns}
                    loading={listMotorbike.length === 0}
                    rowHeight={38}
                    checkboxSelection
                    disableRowSelectionOnClick
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

export default MotorbikeManagement;
