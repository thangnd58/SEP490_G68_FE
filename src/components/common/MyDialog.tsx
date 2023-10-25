import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react'

interface MyDialogProps {
    title: string;
    content: string;
    type?: string;
    onClickAgree: () => void;
    open: boolean;
    handleClickOpen: () => void;
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
    const [open, setOpen] = React.useState(props.open);
    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
            <Button variant="outlined" onClick={props.handleClickOpen}>
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={props.onClickAgree}>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
