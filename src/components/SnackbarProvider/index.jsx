import React from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Button } from '@mui/material';


const CustomSnackbarProvider = ({children}) => {
    return (
        <SnackbarProvider
          action={key => <DismissAction id={key} />}
          maxSnack={6}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
            {children}
        </SnackbarProvider>
    )
}

export default CustomSnackbarProvider

const DismissAction = ({ id }) => {
    const { closeSnackbar } = useSnackbar()
    return <Button variant='none' style={{color: '#fff'}} onClick={() => closeSnackbar(id)}>Close</Button>
}