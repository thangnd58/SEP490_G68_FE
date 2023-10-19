import { Box } from '@mui/system';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../utils/type';
import React, { useState, useEffect } from 'react';
import MotorbikeManagementService from '../../../services/MotorbikeManagementService';
import { VisibilityOutlined } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';

const MotorbikeManagement = () => {

    const [listMotorbike, setListMotorbike] = useState<Motorbike[]>([]);

    useEffect(() => {
        getAllMotorbikes();
    }, [])

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
        { field: 'motorbikeName', headerName: 'Tên xe', width: 150 },
        { field: 'type', headerName: 'Loại xe', width: 200 },
        { field: 'address', headerName: 'Địa chỉ', width: 150 },
        { field: 'licensePlate', headerName: 'Biển số', width: 150 },
        {
            field: 'createDatetime', headerName: 'Ngày tạo', width: 200,
            renderCell: (params: any) => (
                <Box>
                    {new Date(params.value).toLocaleString()}
                </Box>
            ),
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: (params: any) => (
                <Box sx={{ backgroundColor: '#ECFFEE', cursor: 'pointer', width: '100%', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center', color: params.value === 0 ? "warning.main" : params.value === 1 ? "success.main" : "error.main" }}>
                    {
                        params.value === 0 ? "Chờ phê duyệt" : params.value === 1 ? "Đã xác thực" : "Đã hủy"
                    }
                </Box>
            ),
        },
        {
            field: 'id', headerName: 'Hành động', width: 150,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }}>
                    <VisibilityOutlined />
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
        <Box sx={{ height: '88vh', width: '100%' }}>
            <DataGrid
                rows={listMotorbike}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                columns={columns}
                loading={listMotorbike.length === 0}
                rowHeight={38}
                checkboxSelection
                disableRowSelectionOnClick
                pagination
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
                }}
            />
        </Box>
    )
}

export default MotorbikeManagement;