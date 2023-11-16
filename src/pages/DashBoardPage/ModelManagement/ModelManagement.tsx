import { Box, Chip , Typography} from "@mui/material";
import theme from '../../../utils/theme';
import usei18next from "../../../hooks/usei18next";
import { DataGrid } from '@mui/x-data-grid';
import { Add, ArrowBack, CheckCircleOutline, ErrorOutline, WarningAmber } from "@mui/icons-material";
import MyIcon from "../../../components/common/MyIcon";
import EditIcon from '@mui/icons-material/Edit';
import { GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModalContext } from "../../../contexts/ModalContext";
import { useContext, useEffect, useState } from "react";
import MyDialog from "../../../components/common/MyDialog";
import { Model } from "../../../utils/type";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/Constant";
import MyCustomButton from "../../../components/common/MyButton";
import ModelManagementService from "../../../services/ModelManagementService";
const ModelManagement = () => {
    const { t } = usei18next();
    const { closeModal, setShowModal, setContentModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);
    const [listModel, setListModel] = useState<Model[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllModel();
        
    },[]);
    const getAllModel = async () => {
        try {
            const response = await ModelManagementService.getAllModel();
            if (response) {
                setListModel(response);
            }
        } catch (error) {

        }
    }

    const callAPIdelete = async (id: number) => {
        try {
            const response = await ModelManagementService.deleteModel(id);
            if (response.status === 200) {
                ToastComponent(t('toast.ModelManager.Delete.success'), 'success');
                getAllModel();
            } else {
                ToastComponent(t('toast.ModelManager.Delete.warning'), 'warning');
            }
        } catch (error) {
            ToastComponent(t('toast.ModelManager.Delete.error'), 'error');
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
        { field: 'modelName', headerName: t("dashBoardManager.model.modelName"), width: 150 },
        { field: 'brandName', headerName: t("dashBoardManager.brand.Title"), width: 150 },
        {
            field: 'numberOfMotorbike',
            headerName: t("dashBoardManager.model.status"),
            width: 250
        },
        {
            field: 'createdDate',
            headerName: t("dashBoardManager.model.createDate"),
            width: 200,
            renderCell : (params : any) =>(
                <Box>
                    {new Date(params.value).toLocaleString()}

                </Box>
            )
        },
        {
            field: 'updatedDate',
            headerName: t("dashBoardManager.model.updateDate"),
            width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'id',
            headerName: t("dashBoardManager.model.action"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                    <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.managerModel}/${params.value}`)}/>
                    <MyIcon icon={<DeleteIcon />} position='right' hasTooltip tooltipText={t("dashBoardManager.model.delete")} 
                    onClick={() => {
                        setContentModal(<MyDialog icon={<DeleteIcon/>} onClickAgree={() => deleteModel(params.id)} title={t("dashBoardManager.model.confirmDelete")}  content={t("dashBoardManager.model.titleConfirmDelete") + params.row.modelName}  hasAgreeButton={true} hasCancelButton={true}/>)
                    }}/>
                </Box>
            )
        },
    ];

    const deleteModel = (id: number) =>{
        callAPIdelete(id);
    }
    
    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.model")}
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
                    rows={listModel}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listModel.length === 0}
                    rowHeight={48}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    pagination
                    // slots={{ toolbar: GridToolbar }}
                    components={{
                        Toolbar: () => (
                            <Box>
                                <GridToolbar />
                                <MyCustomButton icon={<Add color='primary' />} content={t("dashBoardManager.news.addNews")} variant='outlined' iconPosition='left' noBorder={true} onClick={() => navigate(`${ROUTES.admin.managerModel}/add`)} />
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

export default ModelManagement;
