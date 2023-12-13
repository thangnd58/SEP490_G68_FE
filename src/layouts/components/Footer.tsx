import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Link,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { ArrowBack, Bolt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '../../assets/icons';
import { LogoFull } from './Header';
import usei18next from '../../hooks/usei18next';
import theme from '../../utils/theme';
import { News } from '../../utils/type';
import NewsManagementService from '../../services/NewsManagementService';
import { CategoryNews, GuildlineType, ROUTES } from '../../utils/Constant';

function Footer() {
  const { t } = usei18next();
  const [listNews, setListNews] = useState<News[]>([]);

  useEffect(() => {
    NewsManagementService.getAllNews().then((data) => {
      //@ts-ignore
      setListNews(data.filter((n) => n.category === CategoryNews.policy));
    });
  }, []);

  const chooseTile = (title: string) => {
    switch (title) {
      case "Giải quyết tranh chấp":
        return t("footer.disputeResolution");
      case "Quy chế hoạt động":
        return t("footer.operatingRegulations");
      case "Chính sách và quy định":
        return t("footer.policyAndRegulations");
      default:
        return t("footer.policyTitle");
    }
  }

  const footers = [
    {
      title: t("footer.policyTitle"),
      id: listNews.map((newsItem) => newsItem.newsId),
      description: listNews.map((newsItem) => chooseTile(newsItem.title)),
    },
    {
      title: t("footer.learnMoreTitle"),
      description: [
        t("footer.generalInstructions"),
        t("footer.bookingInstructions"),
        t("footer.paymentInstructions"),
      ],
    }
  ];

  const navigate = useNavigate();
  const handleMailtoClick = () => {
    const email = 'wanderonwheels.wandro@gmail.com';
    const subject = 'Feedback or Inquiry';
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    window.location.href = mailtoURL;
  };

  return (
    <Container fixed component="footer">
      <Grid
        container
        justifyContent="space-between"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box className='logo-full' display={'flex'} flexDirection={'column'} margin={"16px 0px"} gap={"16px"}>
          <LogoFull size={200} />
          <Box
            style={{
              display: 'flex',
              justifyItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #B1B5C3',
              borderRadius: '9px',
              padding: '6px 6px 6px 10px',
            }}
          >
            <input
              disabled
              value={t("editional.sendEmailForUs")}
              type="email"
              style={{ fontSize: '16px', border: 'none', outlineStyle: 'none', color: '#9A9EA5' }}
              placeholder={t("footer.footerEmailPlaceholder")}
            />
            <ArrowBack
              onClick={handleMailtoClick}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'primary.main',
                borderRadius: '20px',
                padding: '2px',
                fill: '#FFF',
                rotate: '180deg',
              }}
            />
          </Box>
        </Box>
        {footers.map((footer, idx) => (
          <Grid item xs={12} md={3} key={idx} style={{ margin: '16px 0' }}>
            <Typography component="div" variant="h5" color="text.primary" gutterBottom>
              <Box sx={{ fontWeight: 'bold' }}>{footer.title}</Box>
            </Typography>
            {footer.description.map((item, index) => (
              <Typography component="div" key={index} color="text.secondary" marginTop={'16px'}>
                <Box sx={{ fontWeight: 'regular', cursor: 'pointer' }} onClick={
                  () => {
                    if (footer.title === t("footer.learnMoreTitle")) {
                      index === 0 && navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.general}`);
                      index === 1 && navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.booking}`);
                      index === 2 && navigate(`${ROUTES.other.guide.generalguide}/${GuildlineType.payment}`);
                    } else {
                      navigate(`${ROUTES.policy}/${footer.id?.find((i, idx) => idx === index)}`)
                    }
                  }}
                >
                  {item}</Box>
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        flexWrap={'wrap'}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          py: [3, 3],
        }}
      >
        <Typography style={{ margin: '8px 0px 0px 8px' }} gutterBottom color="text.secondary">
          <Box>{t("footer.footerCopyright")}</Box>
        </Typography>
        <Box display={'flex'} justifyContent={'end'}>
          <IconButton>
            <FacebookIcon />
          </IconButton>
          <IconButton>
            <LinkedinIcon />
          </IconButton>
          <IconButton>
            <TwitterIcon />
          </IconButton>
          <IconButton>
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
}

export default Footer;
