import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Link,
  Box,
  TextField,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from '../../assets/images';
import { LogoHeader } from '../../assets/images';

function Footer() {
  const footers = [
    {
      title: 'Chính sách',
      description: [
        'Chính sách và quy định',
        'Quy chế hoạt động',
        'Bảo mật thông tin',
        'Giải quyết tranh chấp',
      ],
    },
    {
      title: 'Tìm hiểu thêm',
      description: ['Hướng dẫn chung', 'Hướng dẫn đặt xe', 'Hướng dẫn thanh toán', 'Hỏi và trả lời'],
    },
  ];

  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" component="footer" sx={{marginTop:'0px'}}>
      <Grid
        container
        spacing={4}
        justifyContent="space-evenly"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 3,
          py: [3, 3],
        }}
      >
        <Box>
          <img
            style={{ cursor: 'pointer' }}
            src={LogoHeader}
            width={200}
            alt=""
            onClick={() => navigate(ROUTES.homepage)}
          />
          <div
            style={{
              display: 'flex',
              justifyItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #B1B5C3',
              borderRadius: '9px',
              padding: '6px 6px 6px 10px',
              marginTop: '20px',
            }}
          >
            <input
              type="email"
              style={{ border: 'none', outlineStyle: 'none',color:'9A9EA5' }}
              placeholder="Nhập địa chỉ email"
            />
            <ArrowBack
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '20px',
                padding: '2px',
                fill: '#FFF',
                rotate: '180deg',
              }}
            />
          </div>
        </Box>
        {footers.map((footer, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {footer.title}
            </Typography>
            {footer.description.map((item, index) => (
              <Typography key={index} color="text.secondary" marginTop={'16px'}>
                {item}
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
          mt: 3,
          py: [3, 3],
        }}
      >
        <Typography fontSize={14} color="secondary.main" gutterBottom>
          Copyright© Đai Học FPT Hà Nội
        </Typography>
        <Box display={'flex'} justifyContent={'space-between'} gap={'10px'}>
          <FacebookIcon />
          <LinkedinIcon />
          <TwitterIcon />
          <InstagramIcon />
        </Box>
      </Box>
    </Container>
  );
}

export default Footer;
