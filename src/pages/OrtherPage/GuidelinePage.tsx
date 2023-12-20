import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Box, Paper, Skeleton, Tabs, Tab } from '@mui/material';
import { GuildLineImage, ImageSearchBox } from '../../assets/images';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CategoryNews, GuildlineType, ROUTES } from '../../utils/Constant';
import { News } from '../../utils/type';
import usei18next from '../../hooks/usei18next';
import useThemePage from '../../hooks/useThemePage';
import NewsManagementService from '../../services/NewsManagementService';
import { Content } from 'antd/es/layout/layout';

const GuidelinePage = () => {

  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { guideName } = useParams();
  const [listNews, setListNews] = useState<News[]>([]);
  const { isMobile } = useThemePage();
  const { t } = usei18next();
  const [selectedNews, setSelectedNews] = useState<News>();
  const [guildlineOwner, setGuildlineOwner] = useState<News>();
  const [guildlineCustomer, setGuildlineCustomer] = useState<News>();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const selectIdForGuideline = () => {
    switch (guideName) {
      case GuildlineType.general:
        return "16";
      case GuildlineType.booking:
        return "18";
      case GuildlineType.payment:
        return "19";
      case GuildlineType.regulation:
        return "20";
      default:
        return "16";
    }
  }
  const selectTitleForGuideline = () => {
    switch (guideName) {
      case GuildlineType.general:
        return t("editional.GeneralGuideline");
      case GuildlineType.booking:
        return t("editional.BookGuideline");
      case GuildlineType.payment:
        return t("editional.PaymentGuideline");
      case GuildlineType.regulation:
        return t("editional.RegulationGuideline");
      default:
        return t("editional.GeneralGuideline");
    }
  }

  useEffect(() => {
    if (guideName === GuildlineType.general) {
      NewsManagementService.getNewsById("16").then((data) => {
        //@ts-ignore
        setGuildlineOwner(data);
      });
      NewsManagementService.getNewsById("17").then((data) => {
        //@ts-ignore
        setGuildlineCustomer(data);
      });
    }
    NewsManagementService.getNewsById(selectIdForGuideline()).then((data) => {
      //@ts-ignore
      setSelectedNews(data);
    });
  }, [guideName]);

  const [tabValue, setTabValue] = useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };


  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={isMobile ? '16px 0px' : "64px 0px"} gap={isMobile ? '0px' : "32px"}>
      {/* Phần thứ nhất - Hình ảnh và tiêu đề */}
      <Box sx={{ position: 'relative', width: isMobile ? '90%' : '80%', borderRadius: '8px' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)', // Màu nền có độ mờ
            borderRadius: '8px',
          }}
        />
        <img
          onLoad={handleImageLoad}
          src={GuildLineImage} // Thay thế bằng đường dẫn đến hình ảnh của bạn
          alt="General Guideline"
          style={{ width: '100%', height: isMobile ? '25vh' : '70vh', borderRadius: '8px' }}
        />
        {!imageLoaded && (
          <Skeleton
            variant="rounded"
            width={'100%'}
            animation="wave"
          />
        )}
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          fontSize={isMobile ? '32px' : "48px"}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white', // Thêm màu chữ tùy ý
            zIndex: 1, // Đảm bảo tiêu đề hiển thị trên lớp mờ
          }}
        >
          {selectTitleForGuideline()}
        </Typography>
      </Box>

      {/* Phần thứ hai - Hướng dẫn và nội dung */}
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" width={isMobile ? '90%' : '80%'}>
        {/* Phần thứ nhất - List hướng dẫn */}
        <Box width={isMobile ? '100%' : "20%"} sx={{ overflowY: 'auto' }} maxHeight={"300px"}>
          <List>
            <ListItem
              sx={{
                color: 'common.black',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover, &:focus': {
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                    transition: 'transform 0.3s',
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => {
                navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.general}`);
              }}
            >
              <ListItemText sx={{
                borderLeft: guideName === GuildlineType.general ? '4px solid #8B4513' : 'none',
                fontWeight: guideName === GuildlineType.general ? 700 : 400, paddingLeft: '8px',

              }} primary={t("editional.GeneralGuideline")} />
            </ListItem>
            <ListItem
              sx={{
                color: 'common.black',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover, &:focus': {
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                    transition: 'transform 0.3s',
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => {
                navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.booking}`);
              }}
            >
              <ListItemText sx={{
                borderLeft: guideName === GuildlineType.booking ? '4px solid #8B4513' : 'none',
                fontWeight: guideName === GuildlineType.booking ? 700 : 400,
                paddingLeft: '8px',
              }} primary={t("editional.BookGuideline")} />
            </ListItem>
            <ListItem
              sx={{
                color: 'common.black',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover, &:focus': {
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                    transition: 'transform 0.3s',
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => {
                navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.payment}`);
              }}
            >
              <ListItemText sx={{
                borderLeft: guideName === GuildlineType.payment ? '4px solid #8B4513' : 'none',
                fontWeight: guideName === GuildlineType.payment ? 700 : 400, paddingLeft: '8px',

              }} primary={t("editional.PaymentGuideline")} />
            </ListItem>
            <ListItem
              sx={{
                color: 'common.black',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                '&:hover, &:focus': {
                  '& .MuiListItemText-primary': {
                    fontWeight: 700,
                    transition: 'transform 0.3s',
                    transform: 'scale(1.05)',
                  },
                },
              }}
              onClick={() => {
                navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.regulation}`);
              }}
            >
              <ListItemText sx={{
                borderLeft: guideName === GuildlineType.regulation ? '4px solid #8B4513' : 'none',
                fontWeight: guideName === GuildlineType.regulation ? 700 : 400, paddingLeft: '8px',

              }} primary={t("editional.RegulationGuideline")} />
            </ListItem>
          </List>
        </Box>

        {/* Phần thứ hai - Nội dung Guideline */}
        <Box width={isMobile ? '100%' : '75%'}>
          {
            guideName === GuildlineType.general ? (
              <>
                <Tabs value={tabValue} onChange={handleChangeTab}>
                  <Tab sx={{
                    backgroundColor: tabValue === 0 ? 'rgb(139,69,13,0.05)' : 'none',
                    borderRadius: '16px 16px 0px 0px',
                    color: tabValue === 0 ? '#8B4513' : '#000',
                    fontWeight: tabValue === 0 ? 700 : 400,
                  }} label={t("editional.Owner")} />
                  <Tab sx={{
                    backgroundColor: tabValue === 1 ? 'rgb(139,69,13,0.05)' : 'none',
                    borderRadius: '16px 16px 0px 0px',
                    color: tabValue === 1 ? '#8B4513' : '#000',
                    fontWeight: tabValue === 1 ? 700 : 400,
                  }} label={t("editional.Guest")} />
                </Tabs>
              </>
            ) : (
              null
            )
          }

          <Box sx={{
            backgroundColor: 'rgb(139,69,13,0.05)',
            borderRadius: '8px',
            padding: guideName === GuildlineType.general ? '0 16px' : '24px 32px',
            marginTop: '16px',
          }}
          >
            {
              guideName === GuildlineType.general ? (
                <>
                  <TabPanel value={tabValue} index={0}>
                    {/* Nội dung cho tab "Chủ Xe" */}
                    <Typography sx={{ fontWeight: 'normal', color: "#000" }}>
                      <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: guildlineOwner?.detail || "" }}></div>
                    </Typography>
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    {/* Nội dung cho tab "Khách Thuê Xe" */}
                    <Typography>
                      <div style={{ textAlign: 'justify', color: "#000" }} dangerouslySetInnerHTML={{ __html: guildlineCustomer?.detail || "" }}></div>
                    </Typography>
                  </TabPanel>
                </>
              ) : (
                <Typography>
                  <div style={{ textAlign: 'justify', color: "#000" }} dangerouslySetInnerHTML={{ __html: selectedNews?.detail || "" }}></div>
                </Typography>
              )
            }
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

// TabPanel component để hiển thị nội dung của mỗi tab
const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export default GuidelinePage;
