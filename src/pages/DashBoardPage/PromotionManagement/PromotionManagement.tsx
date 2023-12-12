import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { News, Promotion } from '../../../utils/type';
import React, { useState, useEffect, useContext } from 'react';
import { Add, ChangeCircleOutlined, CheckCircleOutline, Delete, DisabledByDefault, ErrorOutline, StopCircleOutlined, VisibilityOutlined, WarningAmber } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import { ROUTES } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { Button, ButtonGroup, Chip, IconButton, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import MyIcon from '../../../components/common/MyIcon';
import EditIcon from '@mui/icons-material/Edit';
import MyCustomButton from '../../../components/common/MyButton';
import { ModalContext } from '../../../contexts/ModalContext';
import MyDialog from '../../../components/common/MyDialog';
import ToastComponent from '../../../components/toast/ToastComponent';
import { PromotionService } from '../../../services/PromotionService';

const PromotionManagement = () => {
    const { setContentModal } = useContext(ModalContext)
    const [listPromotions, setListPromotions] = useState<Promotion[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [reload, setIsReload] = useState<boolean>(false);

    useEffect(() => {
        getAllPromotions();
    }, [reload])

    const getAllPromotions = async () => {
        try {
            const response = await PromotionService.getAllPromotion();
            if (response) {
                setListPromotions(response)
            }
        } catch (error) {

        }
    }

    const checkExpiredPromotion = (date: string) => {
        const dateCheck = new Date(date);
        const dateNow = Date.now()
        return dateCheck.getTime() < dateNow
    }

    const handleDeletePromotion = async (id: string) => {
        try {
            await PromotionService.deletePromotion(id);
            ToastComponent(t("dashBoardManager.promotions.statusDeletePromotionSuccess"), "success")
            setIsReload((prev) => !prev)
        } catch (error) {
            ToastComponent(t("dashBoardManager.promotions.statusDeletePromotionError"), "error")
        }
    }

    const columns = [
        {
            field: 'title', headerName: t("dashBoardManager.promotions.promotionTitle"), width: 200
        },
        {
            field: 'code', headerName: t("dashBoardManager.promotions.promotionCode"), width: 150
        },
        {
            field: 'startDate', headerName: t("dashBoardManager.promotions.promotionStartDate"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            )
        },
        {
            field: 'endDate', headerName: t("dashBoardManager.promotions.promotionEndDate"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            )
        },
        {
            field: 'numberLeft', headerName: t("dashBoardManager.promotions.promotionLeft"), width: 100,
        },
        {
            field: 'status', headerName: t("dashBoardManager.promotions.promotionStatus"), width: 200,
            renderCell: (params: any) => (
                checkExpiredPromotion(params.row.endDate) === true ?
                    (
                        <Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("dashBoardManager.promotions.endPromotionTime")} />)
                    : checkExpiredPromotion(params.row.startDate) === false ?
                        (
                            <Chip
                                sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                color="warning"
                                icon={<WarningAmber />}
                                label={t("dashBoardManager.promotions.beforePromotionTime")} />)
                        : params.value === false ? (
                            <Chip
                                sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                color="error"
                                icon={<ErrorOutline />}
                                label={t("dashBoardManager.promotions.endPromotionTime")} />)
                            : params.value === true ? (
                                <Chip
                                    sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                                    color="success"
                                    icon={<CheckCircleOutline />}
                                    label={t("dashBoardManager.promotions.inPromotionTime")} />)
                                : (<></>)
            )
        },
        {
            field: 'id', headerName: t("dashBoardManager.news.columnAction"), width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer', display: 'flex' }}>
                    <MyIcon icon={<EditIcon />} hasTooltip position='right' tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.managePromotion}/${params.value}`)} />
                    <MyIcon icon={<DisabledByDefault />} hasTooltip position='right' tooltipText={t("dashBoardManager.promotions.buttonEnd")} onClick={() => {
                        setContentModal(
                            <MyDialog
                                icon={<Delete sx={{ width: '72px', height: '72px' }} />}
                                title={t("dashBoardManager.promotions.deletePromotionTitle")}
                                content={t("dashBoardManager.promotions.deletePromotionWarn")}
                                onClickAgree={() => handleDeletePromotion(params.value)}
                                hasAgreeButton={true}
                                hasCancelButton={true}
                            />
                        )
                    }} />
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
                    {t("dashBoardManager.Navigation.promotions")}
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
                    rows={listPromotions}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listPromotions.length === 0}
                    rowHeight={48}
                    getRowId={(row) => row.id}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    pagination
                    // slots={{ toolbar: GridToolbar }}
                    components={{
                        Toolbar: () => (
                            <Box sx={{ display: 'flex', alignItems: 'start' }}>
                                <GridToolbar />
                                <Button
                                    variant='text'
                                    color='primary'
                                    sx={{
                                        padding: '4px 5px',
                                        mt: '4px'
                                    }}
                                    startIcon={<Add color='primary' />}
                                    onClick={() => navigate(`${ROUTES.admin.managePromotion}/add`)}
                                >
                                    Add
                                </Button>
                            </Box>
                        ),
                    }}
                    slotProps={{
                        toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
                    }}
                />
            </Box>

        </Box>
    )
}

export default PromotionManagement;
