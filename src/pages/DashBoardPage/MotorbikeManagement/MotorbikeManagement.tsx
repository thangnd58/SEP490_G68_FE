import { Box } from '@mui/system';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../utils/type';
import React, { useState, useEffect } from 'react';
import MotorbikeManagementService from '../../../services/MotorbikeManagementService';
import { ChangeCircleOutlined, CheckCircleOutline, ErrorOutline, StopCircleOutlined, VisibilityOutlined, WarningAmber } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import { ROUTES } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { Chip, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import MyIcon from '../../../components/common/MyIcon';
import EditIcon from '@mui/icons-material/Edit';
import {
    HubConnectionBuilder,
    HubConnectionState,
    HubConnection,
} from "@microsoft/signalr";
import { SERVER_URL } from '../../../utils/Constant';

const MotorbikeManagement = () => {

    const [listMotorbike, setListMotorbike] = useState<Motorbike[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        getAllMotorbikes();
    }, [])

    // useEffect(() => {
    //     setUpSignalRConnection().then((con) => { });
    // }, []);

    // const setUpSignalRConnection = async () => {
    //     const connection = new HubConnectionBuilder()
    //         .withUrl(`${SERVER_URL}/customhub`)
    //         .withAutomaticReconnect()
    //         .build();
    //     connection.on("IsReloadMotorbikes", (reload: boolean) => {
    //         setReload((prev) => !prev)
    //     });

    //     try {
    //         await connection.start();
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     return connection;
    // };

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
        {
            field: 'user.name', headerName: t("dashBoardManager.motorbikeRentalManager.columnUserName"), width: 150, valueGetter: ({ row }: any) => row.user.name
        },
        {
            field: 'model.modelName', headerName: t("dashBoardManager.motorbikeRentalManager.columnMotorbikeName"), width: 100, valueGetter: ({ row }: any) => row.model.modelName
        },
        { field: 'type', headerName: t("dashBoardManager.motorbikeRentalManager.columnType"), width: 75 },
        { field: 'address', headerName: t("dashBoardManager.motorbikeRentalManager.columnAddress"), width: 150 },
        { field: 'licensePlate', headerName: t("dashBoardManager.motorbikeRentalManager.columnLicensePlate"), width: 125 },
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
                params.value === "Processing" ? (
                    <Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t('postMotorbike.listform.status-processing')} />)
                    : params.value === "Approved" ? (
                        <Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t('postMotorbike.listform.status-approved')} />)
                        : params.value === "Rejected" ? (
                            <Chip
                                sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                color="error"
                                icon={<ErrorOutline />}
                                label={t('postMotorbike.listform.status-rejected')} />)
                            : params.value === "OnHiatus" ? (
                                <Chip
                                    sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                    color="warning"
                                    icon={<StopCircleOutlined />}
                                    label={t('postMotorbike.listform.status-onhiatus')} />)
                                : (
                                    <Chip
                                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                        color="success"
                                        icon={<ChangeCircleOutlined />}
                                        label={t('postMotorbike.listform.status-inoporation')} />)
            ),
        },
        {
            field: 'id', headerName: t("dashBoardManager.motorbikeRentalManager.columnAction"), width: 100,
            renderCell: (params: any) => (
                params.row.status === "Processing" ?
                    <Box sx={{ cursor: 'pointer' }}>
                        <MyIcon icon={<EditIcon />} hasTooltip position='right' tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.motorbikeregister}/${params.value}`)} />
                    </Box>
                    :
                    null
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
            <Box sx={{ backgroundColor: "#fff", borderRadius: "4px" }}>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-virtualScroller': {
                            minHeight: "300px",
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: "none",
                        },
                    }}
                    rows={listMotorbike}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listMotorbike.length === 0}
                    rowHeight={48}
                    // checkboxSelection
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
