import React, { useEffect, useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MyIcon from '../../../../components/common/MyIcon';
import usei18next from '../../../../hooks/usei18next';
import { Chip, FormControl, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeCircleOutlined, CheckCircleOutline, EditOutlined, ErrorOutline, StopCircleOutlined, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../utils/Constant';
import { DataGrid } from '@mui/x-data-grid';
import { Motorbike } from '../../../../utils/type';
import { PostMotorbikeService } from '../../../../services/PostMotorbikeService';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import MySlideShowImage from '../../../../components/common/MySlideShowImage';

interface CreateFadeEffectImageProps {
  images: string[];
}
const CreateFadeEffectImage = (images: any) => (
  <Box className="slide-container">
    <Fade>
      {images.map((fadeImage: any, index: any) => (
        <Box key={index}>
          <img style={{ width: '100%' }} src={fadeImage} alt={`Image ${index}`} />
        </Box>
      ))}
    </Fade>
  </Box>
);

const ListMotorbikeForm = () => {
  const { t } = usei18next();
  const navigate = useNavigate();

  const [defaultListRegisterMotorbike, setDefaultListRegisterMotorbike] = useState<Motorbike[]>([]);
  const [listRegisterMotorbike, setListRegisterMotorbike] = useState<Motorbike[]>([]);

  useEffect(() => {
    getAllMotorbikesRegistered();
  }, [])

  const getAllMotorbikesRegistered = async () => {
    try {
      const response = await PostMotorbikeService.getListRegisterMotorbike();
      if (response) {
        setListRegisterMotorbike(response);
        setDefaultListRegisterMotorbike(response);
      }
    } catch (error) {

    }
  }

  // get unique status into 2D array has key is status and value is status using i18next
  const getUniqueStatus = [...new Set(listRegisterMotorbike.map(item => item.status))];
  const setUniqueStatus = getUniqueStatus.map(item => {
    return { key: item, value: t(`postMotorbike.listform.status-${item.replace(/\s/g, '').toLowerCase()}`) }
  })

  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value);
  };

  // change the list Register Motorbike when change status
  useEffect(() => {
    if (selectedStatus === "All") {
      setListRegisterMotorbike(defaultListRegisterMotorbike);
    } else {
      console.log(selectedStatus);
      const newList = listRegisterMotorbike.filter(item => item.status === selectedStatus);
      setListRegisterMotorbike(newList);
    }
  }, [selectedStatus])

  const columns = [

    {
      field: 'imageUrl', headerName: t("postMotorbike.listform.table-cell-image"), width: 250,
      renderCell: (params: any) => (
        <Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <img src={params.value[0]} style={{
            width: "150px",
            height: "120px",
            border: '2px solid #8B4513',
            borderRadius: '8px',
          }} alt="image" />
        </Box>
      ),
    },
    { field: 'modelName', headerName: t("postMotorbike.listform.table-cell-model"), width: 150 },
    { field: 'licensePlate', headerName: t("postMotorbike.listform.table-cell-plate"), width: 150 },
    {
      field: 'createDatetime', headerName: t("postMotorbike.listform.table-cell-registerdate"), width: 225,
      renderCell: (params: any) => (
        <Box>
          {new Date(params.value).toLocaleString()}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t("postMotorbike.listform.table-cell-status"),
      width: 175,
      renderCell: (params: any) => (
        params.value === "Processing" ? (
          <Chip
            sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
            color="warning"
            icon={<WarningAmber />}
            label={t('postMotorbike.listform.status-processing')} />)
          : params.value === "Approved" ? (
            <Chip
              sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
              color="success"
              icon={<CheckCircleOutline />}
              label={t('postMotorbike.listform.status-approved')} />)
            : params.value === "Rejected" ? (
              <Chip
                sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                color="error"
                icon={<ErrorOutline />}
                label={t('postMotorbike.listform.status-rejected')} />)
              : params.value === "On Hiatus" ? (
                <Chip
                  sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                  color="warning"
                  icon={<StopCircleOutlined />}
                  label={t('postMotorbike.listform.status-onhiatus')} />)
                : (
                  <Chip
                    sx={{ '& .MuiChip-label': { fontSize: "16px" } }}
                    color="success"
                    icon={<ChangeCircleOutlined />}
                    label={t('postMotorbike.listform.status-inoporation')} />)
      ),
    },
    {
      field: 'id', headerName: t("postMotorbike.listform.table-cell-action"), width: 200,
      renderCell: (params: any) => (
        <MyIcon icon={<EditOutlined />} hasTooltip tooltipText={t("postMotorbike.listform.badge-edit")} onClick={() => navigate(`${ROUTES.user.updateregistermotorbike}/${params.value}`)} position='right' />
      ),
    },
  ];

  return (
    <Box width={"95%"} margin={"32px auto"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignContent={"flex-end"}>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"end"} alignContent={"center"} marginBottom={"8px"}>
        <Typography fontSize={"18px"} fontWeight={"400"}
          margin={"auto 8px"}>{t("postMotorbike.listform.status")}</Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={selectedStatus}
            native
            displayEmpty
            onChange={handleChangeStatus}
          >
            <option value={"All"}>
              <em>{t("postMotorbike.listform.all")}</em>
            </option>
            {setUniqueStatus.map((status) => (
              <option value={status.key}>
                {status.value}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box >
        <Box sx={{ borderRadius: "8px" }}>
          <DataGrid
            sx={{
              cursor: "pointer",
              fontSize: "16px",
              borderRadius: "8px",
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#8B4513",
              },
              '& .MuiDataGrid-columnHeaderTitle ': {
                color: "#fff",
                fontWeight: "600",
                fontSize: "18px",
              }
            }}
            rows={listRegisterMotorbike}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            columns={columns}
            loading={listRegisterMotorbike.length === 0}
            disableRowSelectionOnClick
            rowHeight={150}
            // disableRowSelectionOnClick

            // onRowClick={(params) => {
            //   alert(`You clicked ${params.row.status}`);
            // }}
            pagination
          />
        </Box>
      </Box>
    </Box>
  )
}

// Item Modal
interface ItemModalProps {
  item: Motorbike;
}

// const ItemModal = (props: ItemModalProps) => {
//   const { item } = props;
//   const { t } = usei18next();
//   const [open, setOpen] = useState(false);
//   const [images, setImages] = useState<string[]>([]);

//   useEffect(() => {
//     setImages(item.imageUrl);
//   }, [])

//   return (
//     <Box>
//       <MyIcon icon={<EditOutlined />} hasTooltip tooltipText={t("postMotorbike.listform.badge-edit")} onClick={() => setOpen(true)} position='right' />
//       <MySlideShowImage images={images} />
//     </Box>
//   )
// }



export default ListMotorbikeForm;
