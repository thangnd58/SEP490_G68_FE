import { Box } from '@mui/system';
import { DataGridPro, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import React, { useState, useEffect } from 'react';
import { VisibilityOutlined } from '@mui/icons-material';
import { Lisence } from '../../../utils/type';
import LicenceManagementService from '../../../services/LicenceManagementService';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';
import usei18next from '../../../hooks/usei18next';
import { Typography } from '@mui/material';
import theme from '../../../utils/theme';

const LicenceManagement = () => {
    const [listLicences, setListLicences] = useState<Lisence[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();

    useEffect(() => {
        getAllLicences();
    }, [])

    const getAllLicences = async () => {
        try {
            const response = await LicenceManagementService.getAllLicences();
            if (response) {
                setListLicences(response)
            }
        } catch (error) {

        }
    }

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
        { field: 'licenceNumber', headerName: t("dashBoardManager.licenseManager.columnLicenseNumber"), width: 200 },
        { field: 'fullName', headerName: t("dashBoardManager.licenseManager.columnFullName"), width: 200 },
        { field: 'dob', headerName: t("dashBoardManager.licenseManager.columnDateOfBirth"), width: 200 },
        {
            field: 'createDatetime',
            headerName: t("dashBoardManager.licenseManager.columnCreateDate"),
            width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: t("dashBoardManager.licenseManager.columnStatus"),
            width: 200,
            renderCell: (params: any) => (
                <Box sx={{ backgroundColor: '#ECFFEE', cursor: 'pointer', width: '100%', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center', color: params.value === 0 ? "warning.main" : params.value === 1 ? "success.main" : "error.main" }}>
                    {
                        params.value === 0 ? t("dashBoardManager.licenseManager.statusPending") : params.value === 1 ? t("dashBoardManager.licenseManager.statusVerified") : t("dashBoardManager.licenseManager.statusCancelled")
                    }
                </Box>
            ),
        },
        {
            field: 'licenceId',
            headerName: t("dashBoardManager.licenseManager.columnAction"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }}>
                    <VisibilityOutlined onClick={() => navigate(`${ROUTES.admin.licenceregister}/${params.value}`)} />
                </Box>
            )
        },
    ];

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }}>
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.Navigation.licenseManager")}
                </Typography>
            </Box>
            <Box sx={{ 
                backgroundColor: "#fff", 
                borderRadius: "4px" }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-virtualScroller': {
                            minHeight: "300px",

                        },
                    }}
                    rows={listLicences}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    columns={columns}
                    loading={listLicences.length === 0}
                    rowHeight={38}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.licenceId}
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

export default LicenceManagement;
