import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const customSnackbarStyle = {
    position: 'fixed',
    left: '50%',
    bottom: '15%',
};

export default function CustomizedSnackbars({ open, setOpen }) {
    const { openAlert, message, status } = open
    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleClose} style={customSnackbarStyle}>
                {status === 'successfully' ? <Alert onClose={handleClose} severity="success">
                    {message || 'Ssuccessfully'}
                </Alert>
                    : status === 'error' ? <Alert severity="error">{message || 'Error'}</Alert> : null}
            </Snackbar>
        </div>
    );
}
