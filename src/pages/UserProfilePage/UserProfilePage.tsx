import React, { useEffect, useState } from 'react'
import { CssBaseline, Container, Paper, Box, } from '@mui/material'
import UserProfileComponent from './components/userProfileComponent'
function UserProfilePage() {

  return (
    <div>
      <CssBaseline />
      <Paper elevation={2} style={{margin: '32px auto', width: "60%", borderRadius: "8px" }}>
        <UserProfileComponent />
      </Paper>
    </div>
  )
}

export default UserProfilePage