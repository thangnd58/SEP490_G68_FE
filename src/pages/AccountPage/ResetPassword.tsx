import React from 'react'
import ResetPasswordForm from './components/ResetPasswordForm'
import { Box } from '@mui/material'

const ResetPassword = () => {
    return (
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResetPasswordForm />
        </Box>
    )
}

export default ResetPassword