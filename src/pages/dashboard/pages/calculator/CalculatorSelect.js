import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField, Tooltip
} from '@mui/material';
import {VilaButton} from "../../../../components/Button";
import {useForm} from "react-hook-form";
import {IconChevronDown} from "@tabler/icons-react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import {useEffect, useState} from "react";


const CalculatorSelectAccordion = ({dataId, setData, reset, title, data, setEditObj, type, setSelect}) => {
    const [open, setOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(false)

    const deleting = (id) => {
        setDeleteLoading(true)
        axios.delete(process.env.REACT_APP_NODE_API + `/pages/calculator/selection?id=${dataId}&deletes=${id}&name=${type}`)
            .then(res => {
                setDeleteLoading(false)
                setData(res.data.data);

            })
    }

    return (
        <div className={'calculatorSelect_accordion'}>
            <div className="calculatorSelect_accordion__header" onClick={() => setOpen(!open)}>
                <p>{title}</p>
                <IconChevronDown/>
            </div>
            {
                open ?
                    <div className="calculatorSelect_accordion__content">
                        <div className={'calculatorSelect_accordion__content__header'}>
                            <b>Count</b>
                            <b>English</b>
                            <b>Armenian</b>
                            <b>Russian</b>
                            <b>Controls</b>
                        </div>
                        <div className="calculatorSelect_accordion__content__section"
                             style={{
                                 overflowY: data.length > 3 ? 'scroll' : 'auto',
                                 height: data.length > 3 ? data.length * 23 : 'auto'
                             }}
                        >
                            {
                                data.map((el, i) => (
                                    <div key={el + i}>
                                        <b>{i + 1}</b>
                                        <b>{el.value.en}</b>
                                        <b>{el.value.hy}</b>
                                        <b>{el.value.ru}</b>
                                        <div>
                                            <Tooltip title="Edit" onClick={() => {
                                                reset()
                                                setSelect(type)
                                                setEditObj(el)
                                            }}>
                                                <IconButton>
                                                    <EditIcon/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" onClick={() => {
                                                deleting(el._id)
                                                setDeleteId(el._id)
                                            }}>
                                                <IconButton>
                                                    {
                                                        deleteLoading ?
                                                            deleteId === el._id ?
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
                                ))
                            }
                        </div>
                    </div>
                    :
                    null
            }

        </div>
    )
}

export const CalculatorSelect = () => {
    const {handleSubmit, register, reset} = useForm()
    const [editObj, setEditObj] = useState(null)
    const [data, setData] = useState(null);
    const [select, setSelect] = useState(null);
    const [alert, setAlert] = useState(null);
    const [errorAlert, setErrorAlert] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/pages/calculator/selection')
            .then(res => {
                setData(res.data.data[0]);
            })
    }, []);

    const Submit = (dataInput) => {
        setLoading(true)

        const value = {
            en: dataInput.en ? dataInput.en : editObj.value.en,
            ru: dataInput.ru ? dataInput.ru : editObj.value.ru,
            hy: dataInput.hy ? dataInput.hy : editObj.value.en,
        }

        if (editObj) {
            axios.patch(process.env.REACT_APP_NODE_API + `/pages/calculator/selection`, {
                id: data.id,
                elementId: editObj._id,
                value,
                name: select
            })
                .then(res => {
                    reset()
                    setSelect(null)
                    setEditObj(null)
                    setAlert('Edited successfully')
                    setLoading(false)
                    setData(res.data.data)
                })
                .catch(err => {
                    setLoading(false)
                    setErrorAlert("Error " + err);
                });

            return
        }

        axios.post(process.env.REACT_APP_NODE_API + '/pages/calculator/selection',
            {
                value, name: select, id: data._id
            }
        )
            .then(res => {
                reset()
                setSelect(null)
                setEditObj(null)
                setAlert('Added successfully')
                setLoading(false)
                setData(res.data.data)
            })
            .catch(err => {
                setLoading(false)
                setErrorAlert("Error " + err);
            });

    }

    return (
        data ?
            <div className={'calculatorSelect'}>
                <h3>{editObj ? 'Edit' : 'Add'} Calculation Form</h3>

                <div className={'calculatorSelect__sections'} style={{marginTop: 20}}>
                    <form onSubmit={handleSubmit(Submit)}>
                        <FormControl variant={'standard'} required fullWidth focused={!!select}>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={select}
                                label="Type"
                                onChange={(event) => setSelect(event.target.value)}
                            >
                                <MenuItem value='origin'>Country of origin</MenuItem>
                                <MenuItem value='delivery'>Country of delivery</MenuItem>
                                <MenuItem value='service'>Type of service</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            id="standard-basic"
                            label="English"
                            variant="standard"
                            fullWidth
                            required
                            multiline
                            defaultValue={editObj ? editObj.value.en : ''}
                            focused={!!editObj}
                            {...register('en')}
                        />

                        <TextField
                            id="standard-basic"
                            label="Russian"
                            fullWidth
                            variant="standard"
                            required
                            multiline
                            defaultValue={editObj ? editObj.value.ru : ''}
                            focused={!!editObj}
                            {...register('ru')}
                        />

                        <TextField
                            id="standard-basic"
                            label="Armenian"
                            fullWidth
                            variant="standard"
                            required
                            multiline
                            defaultValue={editObj ? editObj.value.hy : ''}
                            focused={!!editObj}
                            {...register('hy')}
                        />

                        {
                            alert ?
                                <Alert severity={'success'}>{alert}</Alert>
                                :
                                null
                        }

                        {
                            errorAlert ?
                                <Alert severity={'error'}>{errorAlert}</Alert>
                                :
                                null
                        }

                        <div className="calculatorSelect__form__btns">
                            {
                                editObj ?
                                    <Button variant={'text'} type={'reset'} color={'error'} onClick={() => {
                                        reset()
                                        setSelect(null)
                                        setEditObj(null)
                                    }
                                    }>Cancel</Button>
                                    :
                                    null
                            }
                            <VilaButton text={`${editObj ? 'Edit' : 'Save'} Select`} loading={loading}
                                        loadingText={'Saving...'}/>
                        </div>
                    </form>

                    <div className="calculatorSelect__items">
                        <CalculatorSelectAccordion dataId={data._id} setData={setData} reset={reset} setSelect={setSelect} type={'delivery'}
                                                   setEditObj={setEditObj} data={data.select.delivery}
                                                   title={'Country of delivery'}/>
                        <CalculatorSelectAccordion dataId={data._id} setData={setData} reset={reset} setSelect={setSelect} type={'origin'}
                                                   setEditObj={setEditObj} data={data.select.origin}
                                                   title={'Country of origin'}/>
                        <CalculatorSelectAccordion dataId={data._id} setData={setData} reset={reset} setSelect={setSelect} type={'service'}
                                                   setEditObj={setEditObj} data={data.select.service}
                                                   title={'Type of service'}/>
                    </div>
                </div>
            </div>
            :
            <LinearProgress/>
    )
}

