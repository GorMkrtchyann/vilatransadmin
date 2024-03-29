import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    LinearProgress,
    TextField,
    Tooltip
} from "@mui/material";
import { useForm } from "react-hook-form";
import { IconMapPinFilled, IconMapPins, IconPlus, IconWorldLatitude, IconWorldLongitude } from "@tabler/icons-react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import uuid4 from "uuid4";

const mainColor = '#5D87FF'
const inputStyle = { display: "flex", alignItems: "center", gap: 5 }

const MapEditForm = ({ editMap, register }) => {
    return (
        <div>
            <TextField
                fullWidth
                id="standard-basic"
                label={<div style={inputStyle}><IconMapPins size={20} /> Name</div>}
                variant="standard"
                helperText={editMap ? editMap.name : editMap}
                {...register('name')}
                required
            />
            <TextField
                fullWidth
                id="standard-basic"
                label={<div style={inputStyle}><IconWorldLongitude size={20} /> Longitude</div>}
                variant="standard"
                helperText={editMap ? editMap.longitude : editMap}
                {...register('longitude')}
                required
            />
            <TextField
                fullWidth
                id="standard-basic"
                label={<div style={inputStyle}><IconWorldLatitude size={20} /> Latitude</div>}
                variant="standard"
                helperText={editMap ? editMap.latitude : editMap}
                {...register('latitude')}
                required
            />
        </div>
    )
}

const DeleteDialog = ({ setOpen, id, mapArr, setMapArr }) => {

    const handleClose = () => {
        setOpen(false);
    };

    const Delete = () => {
        setOpen(false);
        axios.put(process.env.REACT_APP_NODE_API + '/contact/updateMap', [
            ...mapArr.filter(el => (el.id !== id))
        ]).then(r => {
            if (!r.data.error) {
                setMapArr(r.data.content)
            }
        }
        )
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
                    You Want Delete Office Location?
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

export const MapEdit = () => {
    const { handleSubmit, register, reset } = useForm()
    const [mapArr, setMapArr] = useState(null)
    const [editMap, setEditMap] = useState(null)
    const [open, setOpen] = useState(false);


    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getMap').then(r => {
            if (!r.data.error) {
                setMapArr(r.data.content)
            }
        })
    }, [])

    const Submit = (data) => {
        if (editMap) {
            mapArr?.map(el => {
                if (el.id === editMap.id) {
                    el.name = data.name
                    el.longitude = data.longitude
                    el.latitude = data.latitude
                }
            })

            axios.put(process.env.REACT_APP_NODE_API + '/contact/updateMap', [
                ...mapArr
            ]).then(r => {
                if (!r.data.error) {
                    setMapArr(r.data.content)
                    reset()
                }
            }
            )

            return
        }

        axios.put(process.env.REACT_APP_NODE_API + '/contact/updateMap', [
            ...mapArr,
            {
                id: uuid4(),
                name: data.name,
                longitude: data.longitude,
                latitude: data.latitude
            }
        ]).then(r => {
            if (!r.data.error) {
                setMapArr(r.data.content)
                reset()
            }
        }
        )
    }

    return (
        <div>
            {
                open ? <DeleteDialog id={open} setOpen={setOpen} mapArr={mapArr} setMapArr={setMapArr} /> : null
            }
            <form onSubmit={handleSubmit(Submit)} className={'mapEdit'}>
                <div className={'officesInfo__form__header'}>
                    <h5>{editMap ? 'Edit' : 'Add'} Marker</h5>
                    {
                        editMap ?
                            <Button type={'button'} sx={{ color: mainColor }} variant="text"
                                onClick={() => setEditMap(null)}
                            ><IconPlus /> Add Location</Button>
                            :
                            null
                    }

                </div>
                <div className={'officesInfo__form__inputs'}>
                    {
                        editMap ?
                            <MapEditForm editMap={editMap} register={register} />
                            :
                            <MapEditForm editMap={null} register={register} />
                    }
                </div>

                <div className={'officesInfo__form__btns'}>
                    <Button variant="text" type={'reset'}>clear</Button>
                    <button className={'btn btn-primary fs-4 rounded-2'}>Save Location</button>
                </div>
            </form>
            <div className={'mapEdit__maps'}>
                {
                    mapArr ?
                        mapArr?.map(el => (
                            <ul key={el}>
                                <li><span>Name:</span> {el.name}</li>
                                <li><span>Longitude:</span> {el.longitude}</li>
                                <li><span>Latitude:</span> {el.latitude}</li>
                                <li>
                                    <Tooltip title="Edit" onClick={() => setEditMap(el)}>
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" onClick={() => setOpen(el?.id)}>
                                        <IconButton>
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </li>
                            </ul>

                        ))
                        :
                        <LinearProgress />
                }
            </div>
            <div style={{ height: 400, width: 400, marginTop: 30 }}>
                {
                    mapArr ?
                        <APIProvider apiKey={''}>
                            <Map defaultCenter={{
                                lat: 40.636699,
                                lng: 44.587906
                            }} defaultZoom={8}>
                                {
                                    mapArr?.map(el => (
                                        <Marker position={{
                                            lat: +el.latitude,
                                            lng: +el.longitude
                                        }} title={el.name} label={el.name} />
                                    ))
                                }
                            </Map>
                        </APIProvider>
                        :
                        <LinearProgress />
                }

            </div>
        </div>
    )
}