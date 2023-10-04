import React, { useEffect, useState } from 'react'
import {CssBaseline, Container, Paper,} from '@mui/material'
import UserProfileComponent from './components/userProfileComponent'
function UserProfilePage() {

  return (
    <div>
      <CssBaseline />
      <Container style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '16px', margin: 'auto' }}>
          <UserProfileComponent />
        </Paper>
      </Container>
    </div>
  )
}

export default UserProfilePage