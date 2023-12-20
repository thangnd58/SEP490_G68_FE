import { Box, Button, Chip , Typography} from "@mui/material";
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
import { Brand } from "../../../utils/type";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/Constant";
import MyCustomButton from "../../../components/common/MyButton";
const BrandManagement = () => {
    const { t } = usei18next();
    const { openModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);
    const [listBrand, setListBrand] = useState<Brand[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllBrand();
        
    },[]);
    // console.log(listBrand);
    const getAllBrand = async () => {
        try {
            const response = await PostMotorbikeService.getAllBrand();
            if (response) {
                setListBrand(response);
            }
        } catch (error) {

        }
    }

    const callAPIdelete = async (id: number) => {
        try {
            console.log(id);
            const response = await PostMotorbikeService.deleteBrand(id);
            if (response.status === 200) {
                ToastComponent(t('toast.BrandManager.Delete.success'), 'success');
                getAllBrand();
            } else {
                ToastComponent(t('toast.BrandManager.Delete.warning'), 'warning');
            }
        } catch (error) {
            ToastComponent(t('toast.BrandManager.Delete.error'), 'error');
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

    const deleteBrand = (id: number) =>{
        callAPIdelete(id);
    }
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
            field: 'numberOfModel',
            headerName: t("dashBoardManager.brand.status"),
            width: 250
        },
        {
            field: 'id',
            headerName: t("dashBoardManager.brand.action"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                    <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.managerBrand}/${params.value}`)}/>
                    <MyIcon icon={<DeleteIcon />} position='right' hasTooltip tooltipText={t("dashBoardManager.brand.delete")} 
                    onClick={() => {
                        openModal(<MyDialog icon={<DeleteIcon/>} onClickAgree={() => deleteBrand(params.id)} title={t("dashBoardManager.brand.confirmDelete")}  content={t("dashBoardManager.brand.titleConfirmDelete") + params.row.brandName}  hasAgreeButton={true} hasCancelButton={true}/>)
                    }}/>
                </Box>
            )
        },
    ];

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
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
                    rows={listBrand}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listBrand.length === 0}
                    rowHeight={48}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
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
                                    onClick={() => navigate(`${ROUTES.admin.managerBrand}/add`)}
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

export default BrandManagement;
