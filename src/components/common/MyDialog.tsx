import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useContext } from 'react'
import { ModalContext } from '../../contexts/ModalContext';
import MyCustomButton from './MyButton';
import { LogoHeader } from '../../assets/images';
import usei18next from '../../hooks/usei18next';

interface MyDialogProps {
    title?: string;
    content?: string;
    onClickCancel?: () => void;
    onClickAgree?: () => void;
    hasAgreeButton?: boolean;
    hasCancelButton?: boolean;
    icon?: any;
    style ?: any;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyDialog(props: MyDialogProps) {
    const { closeModal } = useContext(ModalContext);
    const {t} = usei18next();
    return (
        <>
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        padding: "16px",
                        borderRadius: "8px",
                        ...props.style
                    }
                }}
                open={true}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    p: "16px",
                    gap: "16px"
                }}
                >
                    {/* Logo here */}
                    <Box>
                        <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                    </Box>
                    <Box>
                        {props.icon}
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            textAlign: "center",
                            fontSize: "32px"
                        }}>
                            {props.title}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 400 }}>
                            {props.content}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
                        {props.hasCancelButton &&
                            <MyCustomButton
                                variant='outlined'
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={500}
                                content={t("licenseInfo.BtnCancel")}
                                onClick={closeModal}
                            />
                        }
                        {props.hasAgreeButton &&
                            <MyCustomButton
                                borderRadius={8}
                                fontSize={16}
                                fontWeight={500}
                                content={t("VerifyPhone.BtnConfirm")}
                                onClick={() => {
                                    if (props.onClickAgree) {
                                        props.onClickAgree();
                                    }
                                    closeModal();
                                }}
                            />
                        }
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}
