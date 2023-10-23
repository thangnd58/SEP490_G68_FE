import React from 'react'
import LoginForm from './components/LoginForm'
import { Box } from '@mui/material'

function Login() {
  return (
    <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <LoginForm />
    </Box>
  )
}

export default Login