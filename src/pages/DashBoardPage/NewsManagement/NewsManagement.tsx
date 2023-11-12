import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { News } from '../../../utils/type';
import React, { useState, useEffect, useContext } from 'react';
import { Add, ChangeCircleOutlined, CheckCircleOutline, Delete, ErrorOutline, StopCircleOutlined, VisibilityOutlined, WarningAmber } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import { ROUTES } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { Button, ButtonGroup, Chip, IconButton, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import MyIcon from '../../../components/common/MyIcon';
import EditIcon from '@mui/icons-material/Edit';
import NewsManagementService from '../../../services/NewsManagementService';
import MyCustomButton from '../../../components/common/MyButton';
import useThemePage from '../../../hooks/useThemePage';
import { ModalContext } from '../../../contexts/ModalContext';
import MyDialog from '../../../components/common/MyDialog';
import ToastComponent from '../../../components/toast/ToastComponent';

const NewsManagement = () => {
    const { setContentModal } = useContext(ModalContext)
    const [listNews, setListNews] = useState<News[]>([]);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [reload, setIsReload] = useState<boolean>(false);

    useEffect(() => {
        getAllNews();
    }, [reload])

    const getAllNews = async () => {
        try {
            const response = await NewsManagementService.getAllNews();
            if (response) {
                setListNews(response)
            }
        } catch (error) {

        }
    }

    const handleDeleteNews = async (id: string) => {
        try {
            await NewsManagementService.deleteNews(id);
            ToastComponent(t("dashBoardManager.news.statusDeleteNewsSuccess"), "success")
            setIsReload((prev) => !prev)
        } catch (error) {
            ToastComponent(t("dashBoardManager.news.statusDeleteNewsError"), "error")
        }
    }

    const columns = [
        {
            field: 'title', headerName: t("dashBoardManager.news.newsTitle"), width: 200
        },
        {
            field: 'category', headerName: t("dashBoardManager.news.newsCategory"), width: 150
        },
        {
            field: 'createDatetime', headerName: t("dashBoardManager.news.newsCreateDate"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            )
        },
        {
            field: 'updateDatetime', headerName: t("dashBoardManager.news.newsUpdateDate"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            )
        },
        {
            field: 'newsId', headerName: t("dashBoardManager.news.columnAction"), width: 100,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer', display: 'flex' }}>
                    <MyIcon icon={<EditIcon />} hasTooltip position='right' tooltipText={t("userProfile.BtnChange")} onClick={() => navigate(`${ROUTES.admin.manageNews}/${params.value}`)} />
                    <MyIcon icon={<Delete />} hasTooltip position='right' tooltipText={t("dashBoardManager.news.buttonDelete")} onClick={() => {
                        setContentModal(
                            <MyDialog
                                icon={<Delete sx={{ width: '72px', height: '72px' }} />}
                                title={t("dashBoardManager.news.deleteNewsTitle")}
                                content={t("dashBoardManager.news.deleteNewsWarn")}
                                onClickAgree={() => handleDeleteNews(params.value)}
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
                    rows={listNews}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}
                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listNews.length === 0}
                    rowHeight={48}
                    getRowId={(row) => row.newsId}
                    checkboxSelection
                    disableRowSelectionOnClick
                    pagination
                    // slots={{ toolbar: GridToolbar }}
                    components={{
                        Toolbar: () => (
                            <Box>
                                <GridToolbar />
                                <MyCustomButton icon={<Add color='primary' />} content={t("dashBoardManager.news.addNews")} variant='outlined' iconPosition='left' noBorder={true} onClick={() => navigate(`${ROUTES.admin.manageNews}/add`)} />
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

export default NewsManagement;
