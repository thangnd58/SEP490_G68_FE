import React, { useEffect, useState } from 'react'
import { CssBaseline, Container, Paper, Box, } from '@mui/material'
import UserProfileComponent from './components/userProfileComponent'
import useThemePage from '../../hooks/useThemePage'
function UserProfilePage() {
  const { isMobile } = useThemePage();
  return (
    <div>
      <CssBaseline />
      <Paper elevation={2} style={{ margin: '32px auto', width: isMobile ?  "90%" : "60%", borderRadius: "8px" }}>
        <UserProfileComponent />
      </Paper>
    </div>
  )
}

export default UserProfilePage