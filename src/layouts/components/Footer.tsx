import React from 'react';
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
    }];

  const navigate = useNavigate();

  return (
    <Container fixed component="footer">
      <Grid
        container
        justifyContent="space-between"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <div className='logo-full' style={{ margin: '16px 0' }}>
          <LogoFull size={200} />
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
              style={{ fontSize: '16px', border: 'none', outlineStyle: 'none', color: '9A9EA5' }}
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
        </div>
        {footers.map((footer, idx) => (
          <Grid item xs={12} md={3} key={idx} style={{ margin: '16px 0' }}>
            <Typography component="div" variant="h5" color="text.primary" gutterBottom>
              <Box sx={{ fontWeight: 'bold' }}>{footer.title}</Box>
            </Typography>
            {footer.description.map((item, index) => (
              <Typography component="div" key={index} color="text.secondary" marginTop={'16px'}>
                <Box sx={{ fontWeight: 'regular' }}>{item}</Box>
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
          <Box>Copyright© Đại Học FPT Hà Nội</Box>
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
