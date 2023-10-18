import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const ToastComponent = (message : string, type : string) => {
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