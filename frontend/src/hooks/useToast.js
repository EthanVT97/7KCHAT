import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
    const showToast = useCallback((message, type = 'info', options = {}) => {
        const defaultOptions = {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options
        };

        switch (type) {
            case 'success':
                toast.success(message, defaultOptions);
                break;
            case 'error':
                toast.error(message, defaultOptions);
                break;
            case 'warning':
                toast.warning(message, defaultOptions);
                break;
            default:
                toast.info(message, defaultOptions);
        }
    }, []);

    return {
        success: (message, options) => showToast(message, 'success', options),
        error: (message, options) => showToast(message, 'error', options),
        warning: (message, options) => showToast(message, 'warning', options),
        info: (message, options) => showToast(message, 'info', options)
    };
}; 