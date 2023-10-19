import React from 'react';
import { Box, Typography, Button, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { PageNoteFoundImage } from '../../assets/images';
import { ROUTES } from '../../utils/Constant';

export default function PageNotFound() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={12} sm={6}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h1" color="primary" fontWeight={600} sx={{ fontSize: isMobile ? '64px' : '108px' }}>
            404
          </Typography>
          <Typography variant="h6" color="textSecondary" textAlign="center" mt={2} mb={2} fontWeight={500} flexWrap={'wrap'} sx={{ fontSize: isMobile ? '16px' : '20px' }}>
            Sorry, we were unable to find that page.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate(ROUTES.homepage)} sx={{ fontSize: isMobile ? '16px' : '20px' }}>
            Back to Home
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box display="flex" justifyContent="center">
          <img
            src={PageNoteFoundImage}
            alt="Sad Emoji"
            width="100%"
            style={{ maxWidth: isMobile ? '384px' : '512px' }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
