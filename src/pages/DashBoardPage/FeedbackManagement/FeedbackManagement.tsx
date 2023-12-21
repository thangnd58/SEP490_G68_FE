import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect, useContext } from 'react';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import usei18next from '../../../hooks/usei18next';
import { Chip, Typography } from '@mui/material';
import theme from '../../../utils/theme';

import useThemePage from '../../../hooks/useThemePage';
import { Feedback } from '../../../utils/type';
import { FeedbackService } from '../../../services/FeedbackService';
const FeedbackManagement = () => {
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const [listWithdrawal, setListFeedback] = useState<Feedback[]>([]);
    useEffect(() => {
        getAllBrand();
        
    },[]);
    // console.log(listBrand);
    const getAllBrand = async () => {
        try {
            const response = await FeedbackService.getAllFeedback();
            if (response) {
                setListFeedback(response);
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
        {
            field: 'user.name', headerName: t("dashBoardManager.feedback.userName"), width: 200, valueGetter: ({ row }: any) => row.user.name 
        },
        {
            field: 'comment', headerName: t("dashBoardManager.feedback.comment"), width: 350
        },
        {
            field: 'perfomer', headerName: t("dashBoardManager.feedback.perfomer"), width: 200
        },
        {
            field: 'rating', headerName: t("dashBoardManager.feedback.rating"), width: 200
        },
        {
            field: 'createDatetime', headerName: t("dashBoardManager.feedback.createDatetime"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        }
    ];

    return (
        <Box >
            <Box sx={{ backgroundColor: "#8B4513" }}>
                <Typography color={theme.palette.common.white} variant="h1" fontSize={24} fontWeight={700} pb={2}>
                    {t("dashBoardManager.Navigation.feedback")}
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
                        }
                    }}
                    rows={listWithdrawal}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}

                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    getRowId={(row) => row.feedbackId}
                    loading={listWithdrawal.length === 0}
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

export default FeedbackManagement;
