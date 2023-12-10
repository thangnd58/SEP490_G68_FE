import React, { useState, useEffect, useContext } from 'react';
import { BookingService } from "../../../services/BookingService";
import { Booking } from "../../../utils/type";
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import { GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import { Box } from '@mui/system';
import { CheckCircleOutline, ErrorOutline, Visibility, WarningAmber } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import theme from '../../../utils/theme';
import usei18next from '../../../hooks/usei18next';

const BookingManagement = () => {
    const [listBooking, setListBooking] = useState<Booking[]>([]);
    const { t } = usei18next();

    useEffect(() => {
        getAllBooking();
        
    },[]);
    const getAllBooking = async () => {
        try {
            const response = await BookingService.getListBooking();
            if (response) {
                setListBooking(response);
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
            field: 'deliveryMode', headerName: t("dashBoardManager.booking.deliveryMode"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {params.value === 'DeliveryService' ? t("dashBoardManager.booking.DeliveryService") : params.value}
                </Box>
            ),
        },
        {
            field: 'address', headerName: t("dashBoardManager.booking.address"), width: 200
        },
        {
            field: 'status', headerName: t("dashBoardManager.booking.status"), width: 200,
            renderCell: (params: any) => (

                params.value === 'PendingReview' ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t("dashBoardManager.booking.PendingReview")} />)
                    : params.value === 'Finished' ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("dashBoardManager.booking.Finished")} />)
                        :
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("dashBoardManager.booking.Cancelled")} />)

            ),
        },
        {
            field: 'paymentType', headerName: t("dashBoardManager.booking.paymentType"), width: 200,
            renderCell: (params: any) => (
                <Box>
                    {params.value === 'Card' ? t("dashBoardManager.booking.Card") : t("dashBoardManager.booking.UserBalance")}
                </Box>
            ),
            
        },
        {
            field: 'rentalDays', headerName: t("dashBoardManager.booking.rentalDays"), width: 200
        },
        {
            field: 'createDatetime', headerName: t("dashBoardManager.booking.createDatetime"), width: 200,
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
                    {t("dashBoardManager.Navigation.withdrawalRequestManager")}
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
                    rows={listBooking}
                    getRowId={(row) => row.bookingId}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}

                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listBooking.length === 0}
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
export default BookingManagement;
