import { Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, NativeSelect, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Toolbar, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles';
import { Box } from '@mui/system'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';


import React from 'react'
import theme from '../../../../utils/theme';
import { Edit, EditOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ListMotorbikeForm() {


  interface Data {
    id: number;
    image: string;
    model: string;
    licensePlate: string;
    registrationDate: string;
    status: string;
    action: string;
  }

  function createData(
    id: number,
    image: string,
    model: string,
    licensePlate: string,
    registrationDate: string,
    status: string,
    action: string
  ): Data {
    return {
      id,
      image,
      model,
      licensePlate,
      registrationDate,
      status,
      action
    };
  }

  const rows = [
    createData(1, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Honda", "29F1-12345", "21/10/2021", "Đang cho thuê", "Xóa"),
    createData(2, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Yamaha", "29F1-12346", "16/10/2021", "Đang cho thuê", "Xóa"),
    createData(3, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Piaggio", "29F1-12347", "18/10/2021", "Đang cho thuê", "Xóa"),
    createData(4, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "SYM", "29F1-12348", "10/10/2021", "Đang cho thuê", "Xóa"),
    createData(5, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Suzuki", "29F1-12349", "01/10/2021", "Đang cho thuê", "Xóa"),
    createData(6, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Triumph", "29F1-12341", "02/10/2021", "Đang cho thuê", "Xóa"),
    createData(7, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Ducati", "29F1-12342", "03/10/2021", "Đang cho thuê", "Xóa"),
    createData(8, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Vinfast", "29F1-12335", "04/10/2021", "Đang cho thuê", "Xóa"),
    createData(9, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Honda", "29F1-123454", "05/10/2021", "Đã cho thuê", "Xóa"),
    createData(10, "https://tapchigiaothong.qltns.mediacdn.vn/zoom/686_429/tapchigiaothong.vn/files/thu.ha/2017/03/13/honda-wave-alpha-110-vne-8450-3722-1489338975-2019.jpg", "Honda", "29F1-12344", "06/10/2021", "Đang chờ phê duyệt", "Xóa"),
  ];

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      disablePadding: true,
      label: '#',
    },
    {
      id: 'image',
      disablePadding: false,
      label: 'Hình Ảnh',
    },
    {
      id: 'model',
      disablePadding: false,
      label: 'Mẫu xe',
    },
    {
      id: 'licensePlate',
      disablePadding: false,
      label: 'Biển số xe',
    },
    {
      id: 'registrationDate',
      disablePadding: false,
      label: 'Ngày đăng ký',
    },
    {
      id: 'status',
      disablePadding: false,
      label: 'Trạng thái',
    },
    {
      id: 'action',
      disablePadding: false,
      label: 'Chính sửa',
    },
  ];

  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead sx={{ backgroundColor: "#8B4513" }}>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.id === 'id' ? 'center' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography color={theme.palette.common.white} fontWeight={"600"} fontSize={"16px"}>{headCell.label}</Typography>
                {(headCell.id != 'image' && orderBy === headCell.id) ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  interface EnhancedTableToolbarProps {
    numSelected: number;
  }

  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Danh sách xe cho thuê của bạn
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </Toolbar>
    );
  }

  interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  function EnhancedTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const navigate = useNavigate();

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Data,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);

      if (newRowsPerPage === -1) {
        setPage(0);
      }
    };

    const handleChangeToUpdateForm = () => {
      navigate("/update-register-motorbike")
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
      () =>
        stableSort(rows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage],
    );

    return (
      <Box sx={{ width: '100%' }}>
        <Box margin={"0px auto"} width={"100%"} border={"3px solid #8B4513"} borderRadius={"8px"}>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        <Typography fontWeight={600}>{row.id}</Typography>
                      </TableCell>
                      <TableCell align="left" sx={{ padding: "auto" }}><img src={row.image} alt="" width={"100px"} style={{ borderRadius: "8px" }} /></TableCell>
                      <TableCell align="left">{row.model}</TableCell>
                      <TableCell align="left">{row.licensePlate}</TableCell>
                      <TableCell align="left">{row.registrationDate}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                        <IconButton onClick={handleChangeToUpdateForm}>
                          <EditOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
          <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Box>
        </Box>
      </Box>
    );
  }

  const allStatus = rows.map((row) => row.status); // get all status
  const uniqueStatus = Array.from(new Set(allStatus)); // remove duplicate status
  const [selectedStatus, setSelectedStatus] = React.useState(''); // state for selected status
  const [filteredRows, setFilteredRows] = React.useState(rows); // state for filtered rows
  const handleChangeStatus = (event: SelectChangeEvent) => {
    const selected = event.target.value;
    setSelectedStatus(selected);

    // Filter the rows based on the selected status
    if (selected === '') {
      setFilteredRows(rows); // No filter, show all rows
    } else {
      const filtered = rows.filter((row) => row.status === selected);
      setFilteredRows(filtered);
    }
  }; // handle change status
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignContent={"center"}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
        <Typography fontSize={"18px"} fontWeight={"400"}
          margin={"auto 8px"}>Trạng thái :</Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedStatus}
            native
            onChange={handleChangeStatus}
          >
            <option value="">
              <em>Tất cả</em>
            </option>
            {uniqueStatus.map((status) => (
              <option value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"}>
        <EnhancedTable />
      </Box>
    </Box>
  )
}

