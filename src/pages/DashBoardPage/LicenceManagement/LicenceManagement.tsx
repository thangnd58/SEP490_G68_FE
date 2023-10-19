import { Box } from '@mui/system';
import { DataGridPro, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid-pro';
import React, { useState, useEffect } from 'react';
import { VisibilityOutlined } from '@mui/icons-material';
import { Lisence } from '../../../utils/type';
import LicenceManagementService from '../../../services/LicenceManagementService';
import { GridPrintGetRowsToExportParams, GridRowId } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/Constant';


const LicenceManagement = () => {
    const [listLicences, setListLicences] = useState<Lisence[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        getAllLicences();
    }, [])

    const getAllLicences = async () => {
        try {
            const response = await LicenceManagementService.getAllLicences();
            if (response) {
                setListLicences(response)
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
        { field: 'licenceNumber', headerName: 'Số bằng lái', width: 200 },
        { field: 'fullName', headerName: 'Họ và tên', width: 200 },
        { field: 'dob', headerName: 'Ngày sinh', width: 200 },
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
            width: 200,
            renderCell: (params: any) => (
                <Box sx={{ backgroundColor: '#ECFFEE', cursor: 'pointer', width: '100%', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center', color: params.value === 0 ? "warning.main" : params.value === 1 ? "success.main" : "error.main" }}>
                    {
                        params.value === 0 ? "Chờ phê duyệt" : params.value === 1 ? "Đã xác thực" : "Đã hủy"
                    }
                </Box>
            ),
        },
        {
            field: 'licenceId', headerName: 'Hành động', width: 200,
            renderCell: (params: any) => (
                <Box  sx={{ cursor: 'pointer' }}>
                    <VisibilityOutlined onClick={() => navigate(`${ROUTES.admin.licenceRegister}/${params.value}`)}/>
                </Box>
            )
        },
    ];

    return (
        <Box>
            <DataGrid
                rows={listLicences}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                columns={columns}
                loading={listLicences.length === 0}
                rowHeight={38}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.licenceId}
                pagination
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: { printOptions: { getRowsToExport: getSelectedRowsToExport } },
                }}
            />
        </Box>
    )
}

export default LicenceManagement;