import { Box, Button, Chip, Typography } from "@mui/material";
import theme from '../../../utils/theme';
import usei18next from "../../../hooks/usei18next";
import { DataGrid } from '@mui/x-data-grid';
import { Add, ArrowBack, CheckCircleOutline, ErrorOutline, Info, InfoOutlined, WarningAmber } from "@mui/icons-material";
import MyIcon from "../../../components/common/MyIcon";
import EditIcon from '@mui/icons-material/Edit';
import { GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModalContext } from "../../../contexts/ModalContext";
import { useContext, useEffect, useState } from "react";
import MyDialog from "../../../components/common/MyDialog";
import { Model, Report } from "../../../utils/type";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useNavigate } from "react-router-dom";
import { ROUTES, ReportStatus } from "../../../utils/Constant";
import MyCustomButton from "../../../components/common/MyButton";
import ModelManagementService from "../../../services/ModelManagementService";
import { ReportService } from "../../../services/ReportService";
import { ReportFormModal } from "../../ReportComponent/ReportFormModal";
const ReportManagement = () => {
    const { t } = usei18next();
    const { closeModal, setShowModal, setContentModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);
    const [listReport, setListReport] = useState<Report[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllReport();
    }, []);
    const getAllReport = async () => {
        try {
            const response = await ReportService.getAllReportManagement();
            if (response) {
                setListReport(response);
            }
        } catch (error) {

        }
    }

    // const callAPIdelete = async (id: number) => {
    //     try {
    //         const response = await ModelManagementService.deleteModel(id);
    //         if (response.status === 200) {
    //             ToastComponent(t('toast.ModelManager.Delete.success'), 'success');
    //             getAllReport();
    //         } else {
    //             ToastComponent(t('toast.ModelManager.Delete.warning'), 'warning');
    //         }
    //     } catch (error) {
    //         ToastComponent(t('toast.ModelManager.Delete.error'), 'error');
    //     }
    // }

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
        { field: 'reporter.name', headerName: t("report.reporter"), width: 150, valueGetter: ({ row }: any) => row.reporter.name },
        {
            field: 'createDatetime',
            headerName: t("dashBoardManager.model.createDate"),
            width: 200,
            renderCell: (params: any) => (
                <Box>
                    {params.value ? new Date(params.value).toLocaleString() : "N/A"}
                </Box>
            )
        },
        { field: 'detail', headerName: t("report.detailReport"), width: 200 },
        {
            field: 'responder.name', headerName: t("report.responder"), width: 150,
            renderCell: (params: any) => (
                <Box>
                    {params.row.responder ? params.row.responder.name : "N/A"}
                </Box>
            )
        },
        {
            field: 'updateDatetime',
            headerName: t("dashBoardManager.model.updateDate"),
            width: 200,
            renderCell: (params: any) => (
                <Box>
                    {params.value ? new Date(params.value).toLocaleString() : "N/A"}
                </Box>
            ),
        },
        {
            field: 'status', headerName: t("report.status"), width: 200,
            renderCell: (params: any) => (
                params.value === ReportStatus.PendingResponse ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t("report.pendingRes")} />)
                    : params.value === ReportStatus.Responded ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("report.alreadyRes")} />)
                        :
                        (<></>)
            ),
        },
        {
            field: 'reportId',
            headerName: t("dashBoardManager.model.action"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                    <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.manageReport}/${params.value}`)} />
                </Box>
            )
        },
    ];

    // const deleteModel = (id: number) =>{
    //     callAPIdelete(id);
    // }

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.Navigation.report")}
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
                    rows={listReport}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listReport.length === 0}
                    rowHeight={48}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.reportId}
                    pagination
                    // slots={{
                    //     toolbar: GridToolbar

                    // }}
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
                                    startIcon={<InfoOutlined color='primary' />}
                                    onClick={() => setContentModal(<ReportFormModal />)}
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

export default ReportManagement;
