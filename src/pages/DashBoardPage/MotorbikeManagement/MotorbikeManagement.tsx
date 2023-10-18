import { Box } from '@mui/system';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { Motorbike } from '../../../utils/type';
import React, { useState, useEffect } from 'react';
import MotorbikeManagementService from '../../../services/MotorbikeManagementService';
import { Button } from '@mui/material';
import { Visibility, VisibilityOutlined, VisibilitySharp } from '@mui/icons-material';

const MotorbikeManagement = () => {

    const [listMotorbike, setListMotorbike] = useState<Motorbike[]>([]);

    useEffect(() => {
        getAllMotorbikes();
        console.log(listMotorbike)
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
        { field: 'motorbikeName', headerName: 'Tên xe', width: 200 },
        { field: 'type', headerName: 'Loại xe', width: 150 },
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
                <Box sx={{cursor: 'pointer'}}>
                    <VisibilityOutlined />
                </Box>
            )
        },
    ];

    return (
        <Box sx={{ height: '660px', width: '100%' }}>
            <DataGridPro
                rows={listMotorbike}
                columns={columns}
                loading={listMotorbike.length === 0}
                rowHeight={38}
                checkboxSelection
                disableRowSelectionOnClick
                pagination
            />
        </Box>
    )
}

export default MotorbikeManagement;