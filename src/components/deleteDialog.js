import axios from "axios";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import React from "react";


export const DeleteDialog = ({setOpen, onDelete, text}) => {

    return (
        <Dialog
            open={true}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} autoFocus>No</Button>
                <Button onClick={() => {
                    onDelete()
                    setOpen(false)
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}