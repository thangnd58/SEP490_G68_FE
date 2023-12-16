import { Box } from '@mui/system';
import { DataGridPro, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import React, { useState, useEffect } from 'react';
import { CheckCircleOutline, ErrorOutline, VisibilityOutlined, WarningAmber } from '@mui/icons-material';
import { Lisence } from '../../../utils/type';
import LicenceManagementService from '../../../services/LicenceManagementService';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';
import usei18next from '../../../hooks/usei18next';
import { Chip, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import MyIcon from '../../../components/common/MyIcon';
import EditIcon from '@mui/icons-material/Edit';
import { connection } from '../../../redux/reducers/signalRReducer';

const LicenceManagement = () => {
    const [listLicences, setListLicences] = useState<Lisence[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [reloadLicence, setReloadLicence] = useState<boolean>(false);

    useEffect(() => {
        getAllLicences();
    }, [reloadLicence])

    useEffect(() => {
        connection.on('IsReloadLicence', () => {
            setReloadLicence((prev) => !prev)
        });
    }, []);

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
        { field: 'licenceNumber', headerName: t("dashBoardManager.licenseManager.columnLicenseNumber"), width: 150 },
        { field: 'fullName', headerName: t("dashBoardManager.licenseManager.columnFullName"), width: 200 },
        { field: 'dob', headerName: t("dashBoardManager.licenseManager.columnDateOfBirth"), width: 150 },
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
            field: 'licenceId',
            headerName: t("dashBoardManager.licenseManager.columnAction"),
            width: 100,
            renderCell: (params: any) => (
                params.row.status === 0 ?
                    <Box sx={{ cursor: 'pointer' }}>
                        <MyIcon icon={<EditIcon />} position='right' hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.licenceregister}/${params.value}`)} />
                    </Box>
                    :
                    null
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
                    rows={listLicences}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listLicences.length === 0}
                    rowHeight={48}
                    // checkboxSelection
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
