import { Container, Grid, Typography, Link, Box, TextField, Input } from '@mui/material'
import React from 'react'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from '../../assets/images';
import { LogoHeader } from '../../assets/images'
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';



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

  const navigate = useNavigate()
  return (
    <Container
      maxWidth="lg"
      component="footer"
    >
      <Grid container spacing={4} justifyContent="space-evenly"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 3,
          py: [3, 3],
        }}
      >
        <Box>
          <img src={LogoHeader} width={200} alt='' onClick={() => navigate(ROUTES.homepage)} />
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', border: '1px solid #777E90', borderRadius: '24px', padding: '6px 6px 6px 10px', marginTop: '20px' }}>
            <input type='email' style={{ border: 'none', outlineStyle: 'none' }} placeholder='Nhập địa chỉ email' />
            <ArrowBack sx={{ backgroundColor: 'primary.main', borderRadius: '20px', padding: '2px', fill: '#FFF', rotate: '180deg' }} />
          </div>
        </Box>
        {footers.map((footer) => (
          <Grid item xs={6} sm={3} key={footer.title}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {footer.title}
            </Typography>
            {footer.description.map((item) => (
              <Typography color="text.secondary" marginTop={'10px'}>
                {item}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
      <Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 3,
          py: [3, 3],
        }}
      >
        <Typography fontSize={14} color='secondary.main' gutterBottom>
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
  )
}

export default Footer