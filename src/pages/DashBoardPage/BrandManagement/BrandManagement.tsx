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
import { ModalContext } from "../../../contexts/ModalContext";
import ModalDeleteBrand from "./component/ModalDeleteBrand";
import { useContext, useEffect, useState } from "react";
import MyDialog from "../../../components/common/MyDialog";
import { Brand } from "../../../utils/type";
import { PostMotorbikeService } from "../../../services/PostMotorbikeService";
import ToastComponent from "../../../components/toast/ToastComponent";
const BrandManagement = () => {
    const { t } = usei18next();
    const { closeModal, setShowModal, setContentModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);
    const [listBrand, setListBrand] = useState<Brand[]>([]);


    useEffect(() => {
        getAllBrand();
    },[]);
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
                    <MyIcon icon={<EditIcon />} position='left' hasTooltip tooltipText={t("userProfile.BtnChange")} />
                    <MyIcon icon={<DeleteIcon />} position='right' hasTooltip tooltipText={t("dashBoardManager.brand.delete")} 
                    onClick={() => {
                        setContentModal(<MyDialog icon={<DeleteIcon/>} onClickAgree={() => deleteBrand(params.id)} title={t("dashBoardManager.brand.confirmDelete")}  content={t("dashBoardManager.brand.titleConfirmDelete") + params.row.brandName}  hasAgreeButton={true} hasCancelButton={true}/>)
                    }}/>
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
                    rows={listBrand}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listBrand.length === 0}
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
