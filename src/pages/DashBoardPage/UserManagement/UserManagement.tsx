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
import { Model, User } from "../../../utils/type";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import ToastComponent from "../../../components/toast/ToastComponent";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../utils/Constant";
import MyCustomButton from "../../../components/common/MyButton";
import ModelManagementService from "../../../services/ModelManagementService";
import UserService from "../../../services/UserService";
const UserManagement = () => {
    const { t } = usei18next();
    const { closeModal, setShowModal, setContentModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);
    const [listUser, setListUser] = useState<User[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllUser();
    },[]);
    const getAllUser = async () => {
        try {
            const response = await UserService.getAllUserManage();
            if (response) {
                setListUser(response);
            }
        } catch (error) {

        }
    }

    const callAPIdelete = async (id: number) => {
        
        try {
            const response = await UserService.deleteUserByIdManage(id);
            if (response.status === 200) {
                ToastComponent(t('toast.ModelManager.Delete.success'), 'success');
                getAllUser();
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
        { field: 'name', headerName: t("userProfile.Name"), width: 150 },
        { field: 'email', headerName: t("userProfile.Email"), width: 200 },
        { field: 'phone', headerName: t("userProfile.PhoneNumber"), width: 150 },
        { field: 'address', headerName: t("userProfile.Address"), width: 200 },
        {
            field: 'dob',
            headerName: t("userProfile.DOB"),
            width: 150,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleDateString()}
                </Box>
            ),
        },
        {
            field: 'role',
            headerName: t("userProfile.Role"),
            width: 120,
            renderCell: (params: any) => (
                <Box>
                    {params.row.role.roleName}
                </Box>
            ),
        },
        {
            field: 'userId',
            headerName: t("dashBoardManager.model.action"),
            width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }} display={'flex'}>
                    {/* <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.managerModel}/${params.value}`)}/> */}
                    <MyIcon icon={<DeleteIcon />} position='right' hasTooltip tooltipText={t("dashBoardManager.model.delete")} 
                    onClick={() => {
                        setContentModal(<MyDialog icon={<DeleteIcon/>} onClickAgree={() => deleteUser(params.value)} title={t("dashBoardManager.user.confirmDelete")}  content={t("dashBoardManager.user.titleConfirmDelete") + params.row.email}  hasAgreeButton={true} hasCancelButton={true}/>)
                    }}/>
                </Box>
            )
        },
    ];

    const deleteUser = (id: number) =>{
        console.log(id);
        callAPIdelete(id);
    }
    
    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }} width={'100%'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1} >
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700}>
                    {t("dashBoardManager.Navigation.user")}
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
                    rows={listUser}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listUser.length === 0}
                    rowHeight={48}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row.userId}
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
                                    onClick={() => navigate(`${ROUTES.admin.managerModel}/add`)}
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

export default UserManagement;
