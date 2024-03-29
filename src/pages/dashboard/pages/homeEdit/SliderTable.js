import React, {useRef, useState} from 'react';
import axios from "axios";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DeleteDialog = ({setOpen, id, setAllData, setDeleteLoading}) => {

    const handleClose = () => {
        setDeleteLoading(false)
        setOpen(false);
    };

    const Delete = async () => {
        setOpen(false);

        const res = await axios.delete(process.env.REACT_APP_NODE_API + `/home/slide-delete/${id}`);

        if (res.data) {
            setAllData(res.data)
            setDeleteLoading(false);
        }
    }

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You Want Delete Slide?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>No</Button>
                <Button onClick={Delete}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export const SliderTable = ({setEditSlide, allData, setAllData}) => {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    const deleteSlide = (id) => {
        setDeleteLoading(true);
        setOpen(true)
        setDeletedId(id)
    }

    return (
        <div className={'blockForm__table'}>
            <div className="blockForm__table__header">
                {
                    allData.length > 0 ?
                        <>
                            <h6>Image/Video</h6>
                            <h6>Title</h6>
                            <h6>Description</h6>
                            <h6>Button Link</h6>
                            <h6>Editors</h6>
                        </>
                    :
                    null}
            </div>

            <div className="blockForm__table__body">
                {allData.map((elem, index) => (
                    <div key={elem._id} className={'blockForm__table__body__item'}>
                        {
                            open ?
                                <DeleteDialog id={elem._id} setOpen={setOpen} setAllData={setAllData} setDeleteLoading={setDeleteLoading}/>
                                :
                                null
                        }
                        <div>
                            {elem.img.startsWith("data:image") ?
                                <img className={'list-img'} src={elem.img} alt="img"/> :
                                <video src={elem.img} className={'list-img'} autoPlay={true}/>}
                        </div>
                        <p>{elem.title.en}</p>
                        <p>{elem.description.en}</p>
                        <p className={'link--btn'}>{elem.link}</p>
                        <div className={'btn-td'}>
                            <Tooltip title="Edit">
                                <IconButton onClick={() => setEditSlide(elem)}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" onClick={() => deleteSlide(elem._id)}>
                                <IconButton>
                                    {
                                        deleteLoading ?
                                            deletedId === elem._id ?
                                                <CircularProgress color={'inherit'} style={{width: 25, height: 25}}/>
                                                :
                                                <DeleteOutlineOutlinedIcon/>
                                            :
                                            <DeleteOutlineOutlinedIcon/>
                                    }
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

