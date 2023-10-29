import { styled } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = (message: string, type: string) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        case 'error':
            toast.error(message);
            break;
        default:
            toast(message);
    }
};

export default ToastComponent;