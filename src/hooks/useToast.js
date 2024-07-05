import { useSnackbar } from 'notistack';
import {
    Zoom
} from '@mui/material';

const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    return {
        toast: (text, variant, vertical, horizontal) => enqueueSnackbar(text || 'Please setup a text to show', {
            variant: variant || 'success',
            anchorOrigin: {
              vertical: vertical || 'top',
              horizontal: horizontal || 'right'
            },
            TransitionComponent: Zoom
        })
    }
}
export default useToast