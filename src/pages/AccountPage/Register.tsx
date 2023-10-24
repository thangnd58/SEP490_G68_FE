import React from 'react'
import RegisterForm from './components/RegisterForm'
import { Box } from '@mui/material'

function Register() {
  return (
    <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <RegisterForm />
    </Box>
  )
}

export default Register