import { Paper, Typography } from "@mui/material"
import useThemePage from "../../hooks/useThemePage";
import { EmailIcon } from "../../assets/images";
import usei18next from "../../hooks/usei18next";
import { useState } from "react";




const VerifyRegister = () => {
    const { isMobile } = useThemePage();
    const { t } = usei18next();
    const [ticket, setTicket] = useState();
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} style={{ padding: '20px', width: isMobile ? "80%" : "30%", margin: '0 auto', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', flexDirection: 'column' }}>
                    <img src={EmailIcon} />
                    <Typography color='secondary.main' marginBottom='1.5rem' width='80%' textAlign='center' alignContent='center'>
                        Email đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra hòm thư để hoàn thành đăng ký
                    </Typography>
                </div>
            </Paper>
        </div>
    )
}

export default VerifyRegister