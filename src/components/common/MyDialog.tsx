import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useContext } from 'react'
import { ModalContext } from '../../contexts/ModalContext';

interface MyDialogProps {
    title: string;
    content: string;
    onClickAgree: () => void;
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

    return (
        <>
            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeModal}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal}>Disagree</Button>
                    <Button onClick={props.onClickAgree}>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
