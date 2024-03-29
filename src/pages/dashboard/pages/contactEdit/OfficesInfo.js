import {
    Button,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip
} from "@mui/material";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandTwitter, IconBuildingSkyscraper, IconClockHour6, IconClockHour8, IconEdit,
    IconMail,
    IconMapPin,
    IconPhone,
    IconPlus, IconTrash
} from "@tabler/icons-react";
import {useForm} from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import uuid4 from "uuid4";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from "axios";

const mainColor = '#5D87FF'

const OfficesInfoForm = ({setInfosArr, editObj, setAddForm, setEditObj}) => {
    const inputStyle = {display: "flex", alignItems: "center", gap: 5}
    const {handleSubmit, register, reset} = useForm()
    const [socialMedia, setSocialMedia] = useState({
        facebook: null,
        instagram: null,
        twitter: null,
    })
    const [secondPhone, setSecondPhone] = useState(false)

    const Submit = (data) => {
        const sendingObj = {
            name: {
                en: data.name,
                hy: data.nameArm,
                ru: data.nameRus
            },
            openClock: data.openClock,
            closeClock: data.closeClock,
            address: {
                en: data.address,
                hy: data.addressArm,
                ru: data.addressRus
            },
            phones: [data.phone],
            email: data.email,
        }

        if (data.secondPhone) {
            sendingObj.phones.push(data.secondPhone)
        }

        if (data.facebook) {
            sendingObj.social = {
                facebook: data.facebook,
            }
        }

        if (editObj) {
            axios.put(process.env.REACT_APP_NODE_API + '/contact/editOfficeInfo',
                {
                    id: editObj._id,
                    ...sendingObj
                }
            ).then(res => {
                if (!res.data.error) {
                    setInfosArr(res.data)
                    reset()
                    setEditObj(null)
                    setAddForm(false)
                }
            })

            return
        }

        axios.post(process.env.REACT_APP_NODE_API + '/contact/addOfficeInfo',
            sendingObj
        ).then(res => {
            if (!res.data.error) {
                setInfosArr(res.data)
                reset()
                setAddForm(false)
            }
        })
    }

    const AddInput = (type, label, icon) => {
        socialMedia[label.toLowerCase()] = <TextField
            fullWidth
            type={type}
            id="standard-basic"
            label={<div style={inputStyle}>{icon} {label}</div>}
            variant="standard"
            defaultValue={editObj ? editObj.social ? editObj.social[label.toLowerCase()] : null : null}
            {...register(label.toLowerCase())}
            required
        />

        setSocialMedia({...socialMedia})
    }

    return (
        <form onSubmit={handleSubmit(Submit)}>
            <div className={'officesInfo__form__header'}>
                <h5>{editObj ? 'Edited' : 'Added'} Office</h5>

            </div>
            <div className={'officesInfo__form__inputs'}>
                <div>
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconBuildingSkyscraper size={20}/> Name</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.name.en : null}
                        {...register('name')}
                        required
                    />
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconBuildingSkyscraper size={20}/> Name With Armenian</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.name.hy : null}
                        {...register('nameArm')}
                        required
                    />
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconBuildingSkyscraper size={20}/> Name With Russian</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.name.ru : null}
                        {...register('nameRus')}
                        required
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        type={"email"}
                        id="standard-basic"
                        label={<div style={inputStyle}><IconMail size={20}/> Email</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.email : null}
                        {...register('email')}
                        required
                    />
                    <TextField
                        fullWidth
                        type={"tel"}
                        id="standard-basic"
                        label={<div style={inputStyle}><IconPhone size={20}/> Phone</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.phones[0] : null}
                        {...register('phone')}
                        required
                    />
                    {
                        secondPhone ?
                            <TextField
                                fullWidth
                                type={"tel"}
                                id="standard-basic"
                                label={<div style={inputStyle}><IconPhone size={20}/>Second Phone</div>}
                                variant="standard"
                                defaultValue={editObj ? editObj.phones[1] : null}
                                {...register('secondPhone')}
                                required
                            />
                            :
                            <Button
                                type={'button'}
                                sx={{color: mainColor}}
                                variant="text"
                                onClick={() => setSecondPhone(true)}
                            ><IconPlus/> Add Second Phone</Button>
                    }
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconMapPin size={20}/> Address</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.address.en : null}
                        {...register('address')}
                        required
                    />
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconMapPin size={20}/> Address With Armenian</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.address.en : null}
                        {...register('addressArm')}
                        required
                    />
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconMapPin size={20}/> Address With Russian</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.address.en : null}
                        {...register('addressRus')}
                        required
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconClockHour8 size={20}/> Opening Clock</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.openClock : null}
                        {...register('openClock')}
                        required
                    />
                    <TextField
                        fullWidth
                        id="standard-basic"
                        label={<div style={inputStyle}><IconClockHour6 size={20}/> Closing Clock</div>}
                        variant="standard"
                        defaultValue={editObj ? editObj.closeClock : null}
                        {...register('closeClock')}
                        required
                    />


                    {
                        socialMedia.facebook ? socialMedia.facebook :
                            <Button type={'button'} sx={{color: mainColor}} variant="text"
                                    onClick={() => AddInput('url', 'Facebook', <IconBrandFacebook/>)}
                            ><IconPlus/> Add Facebook</Button>
                    }
                </div>
            </div>

            <div className={'officesInfo__form__btns'}>
                <Button variant="text">clear</Button>
                <button className={'btn btn-primary fs-4 rounded-2'}>Save This Office</button>
            </div>
        </form>
    )
}

const DeleteDialog = ({setOpen, id, setInfosArr}) => {

    const handleClose = () => {
        setOpen(false);
    };

    const Delete = () => {
        setOpen(false);
        axios.put(process.env.REACT_APP_NODE_API + '/contact/deleteOfficeInfo',
            {
                id: id
            }
        ).then(res => {
            if (!res.data.error) {
                setInfosArr(res.data)
            }
        })
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
                    You Want Delete Office?
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

const OfficeInfoDetails = ({obj, setEditObj, setAddForm, setInfosArr}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={'officesInfo__details'}>
            {
                open ? <DeleteDialog setInfosArr={setInfosArr} setOpen={setOpen} id={obj._id}/> : null
            }
            <div className={'officesInfo__details__editors'}>
                <h4>Office Info</h4>

                <div>
                    <Tooltip title="Edit" onClick={() => {
                        setAddForm(false)
                        setEditObj(obj)
                    }}>
                        <IconButton>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" onClick={() => setOpen(true)}>
                        <IconButton>
                            <DeleteOutlineOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <ul>
                <li><span><IconBuildingSkyscraper/> Name:</span> {obj.name.en}</li>
                <li><span><IconBuildingSkyscraper/> Name With Armenian:</span> {obj.name.hy}</li>
                <li><span><IconBuildingSkyscraper/> Name With Russian:</span> {obj.name.ru}</li>
                <li><span><IconPhone/> Phone:</span> {obj.phones[0]}</li>
                {
                    obj.phones[1] ?
                        <li><span><IconPhone/> Second Phone:</span> {obj.phones[1]}</li>
                        :
                        null
                }
                <li><span><IconMail/> Email:</span> {obj.email}</li>
                <li><span><IconMapPin/> Address:</span> {obj.address.en}</li>
                <li><span><IconMapPin/> Address With Armenian:</span> {obj.address.hy}</li>
                <li><span><IconMapPin/> Address With Russian:</span> {obj.address.ru}</li>
                <li><span><IconClockHour8/> Open:</span> {obj.openClock}</li>
                <li><span><IconClockHour6/> Close:</span> {obj.closeClock}</li>
                <li>
                    {
                        obj.social ?
                            <a href={obj.social.facebook} target={"_blank"}><IconBrandFacebook/></a>
                            :
                            null
                    }
                </li>
            </ul>
        </div>
    )
}

export const OfficesInfo = () => {
    const [infosArr, setInfosArr] = useState(null)
    const [editObj, setEditObj] = useState(null)
    const [addForm, setAddForm] = useState(false)


    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getAllOfficeInfo'
        ).then(r => {
            if (!r.data.error) {
                setInfosArr(r.data)
            }
        })
    }, [])

    return (
        <div className={'officesInfo'}>
            <div className={'officesInfo__header'}>
                <h3>Offices Info</h3>
                <Button type={'button'} sx={{color: mainColor}} variant="text"
                        onClick={() => setAddForm(true)}
                ><IconPlus/> Add Office</Button>
            </div>

            <div className={'officesInfo__forms'}>
                {
                    addForm || editObj ?
                        <OfficesInfoForm
                            count={addForm.length}
                            setInfosArr={setInfosArr}
                            infosArr={infosArr}
                            editObj={editObj}
                            setAddForm={setAddForm}
                            setEditObj={setEditObj}
                        />
                        :
                        null
                }
                {addForm}
            </div>

            <div className={'officesInfo__forms'} style={{marginTop: 30}}>
                {
                    infosArr ?
                        infosArr.length ?
                            infosArr?.map(el => (
                                <OfficeInfoDetails setInfosArr={setInfosArr} obj={el} setEditObj={setEditObj}
                                                   setAddForm={setAddForm}/>
                            ))
                            :
                            <p>Dont Have Offices</p>
                        :
                        <CircularProgress/>
                }
            </div>
        </div>
    )
}