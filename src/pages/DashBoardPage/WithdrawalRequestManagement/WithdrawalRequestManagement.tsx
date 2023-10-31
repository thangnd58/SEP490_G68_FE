import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { ResponseWithDrawal } from '../../../utils/type';
import React, { useState, useEffect, useContext } from 'react';
import { CheckCircleOutline, ErrorOutline, Visibility, WarningAmber } from '@mui/icons-material';
import { GridPrintGetRowsToExportParams, GridRowId, GridToolbar, gridFilteredSortedRowIdsSelector, selectedGridRowsSelector } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import usei18next from '../../../hooks/usei18next';
import { Chip, Typography } from '@mui/material';
import theme from '../../../utils/theme';
import MyIcon from '../../../components/common/MyIcon';
import WalletService from '../../../services/WalletService';
import { formatMoney } from '../../../utils/helper';
import { ModalContext } from '../../../contexts/ModalContext';
import ModalQrCode from './component/ModalQrCode';

const WithdrawalRequestManagement = () => {

    const [listWithdrawal, setListWithdrawal] = useState<ResponseWithDrawal[]>([]);
    const { t } = usei18next();
    const { closeModal, setShowModal, setContentModal } = useContext(ModalContext);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        getAllWithdrawals();
    }, [reload])

    const getAllWithdrawals = async () => {
        try {
            const response = await WalletService.getAllRequestWithdrawal();
            if (response) {
                setListWithdrawal(response.data)
            }
        } catch (error) {

        }
    }

    const columns = [
        {
            field: 'nameInBank', headerName: t("dashBoardManager.withdrawalRequest.columnAccountName"), flex: 1
        },
        {
            field: 'bankNumber', headerName: t("dashBoardManager.withdrawalRequest.columnAccountNumber"), flex: 1
        },
        {
            field: 'withdraw', headerName: t("dashBoardManager.withdrawalRequest.columnAmount"), flex: 1,
            renderCell: (params: any) => {
                return formatMoney(params.value)
            }
        },
        {
            field: 'status',
            headerName: t("dashBoardManager.motorbikeRentalManager.columnStatus"),
            flex: 1,
            renderCell: (params: any) => (
                params.value === "Processing" ?
                    (<Chip
                        sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                        color="warning"
                        icon={<WarningAmber />}
                        label={t("wallet.status_withdrawal_processing")} />)
                    : params.value === "Done" ?
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="success"
                            icon={<CheckCircleOutline />}
                            label={t("wallet.status_withdrawal_done")} />)
                        :
                        (<Chip
                            sx={{ '& .MuiChip-label': { fontSize: "14px" } }}
                            color="error"
                            icon={<ErrorOutline />}
                            label={t("wallet.status_withdrawal_cancel")} />)
            ),
        },
        {
            field: 'id', headerName: t("dashBoardManager.withdrawalRequest.columnViewQr"), flex: 1,
            renderCell: (params: any) => (
                <Box sx={{ cursor: 'pointer' }}>
                    <MyIcon icon={<Visibility />} hasTooltip position='right' tooltipText={t("userProfile.BtnChange")} onClick={() => {
                        setContentModal(<ModalQrCode setReload={setReload} withdrawal={params.row} />)
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
                        },
                    }}
                    rows={listWithdrawal}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 7 } },
                    }}

                    pageSizeOptions={[7, 10, 25]}
                    columns={columns}
                    loading={listWithdrawal.length === 0}
                    rowHeight={48}
                    checkboxSelection
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

export default WithdrawalRequestManagement;
