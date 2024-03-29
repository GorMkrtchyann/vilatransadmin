import {
    Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    FormControl,
    IconButton,
    InputLabel, LinearProgress,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Tooltip
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {FileUploadInput} from "../../../../components/fileUploadInput";
import {VilaButton} from "../../../../components/Button";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";
import {IconEye, IconPlus, IconTrash} from "@tabler/icons-react";
import {useForm} from "react-hook-form";
import axios from "axios";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const DeleteDialog = ({setOpen, yesFunc, text}) => {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>No</Button>
                <Button onClick={() => {
                    yesFunc()
                    setOpen(false);
                }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const InfoMapNumberForm = ({numbersArr, handleSubmit, valuesArr, register, resetForm, seePreview, setNumbersArr}) => {
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const Submit = () => {
        setLoading(true)
        seePreview()
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoMap?type=numbers', numbersArr
        ).then(r => {
            if (!r.data.error) {
                setLoading(false)
                setAlert('This Number is saved')
                setTimeout(() => setAlert(false), 3000)
            }
        })
    }

    const Delete = () => {
        const deleting = numbersArr.filter(el => (el !== valuesArr))

        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoMap?type=numbers', deleting
        ).then(r => {
            if (!r.data.error) {
                setNumbersArr(r.data)
                setDeleteLoading(false)
                setAlert('Number is deleted')
                setTimeout(() => setAlert(false), 3000)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(Submit)}>
            {
                deleteDialog ?
                    <DeleteDialog yesFunc={Delete} setOpen={setDeleteDialog} text={'Are you sure delete this number?'}/>
                    :
                    null
            }
            <div className={'flexing'}>
                <div className={'formInputs'}>
                    <div>
                        <TextField
                            fullWidth
                            type={'number'}
                            id="standard-basic"
                            label={'Number'}
                            variant="standard"
                            helperText={valuesArr.en.number}
                            {...register('number')}
                            required={!valuesArr.en.number}
                        />

                        <TextField
                            fullWidth
                            id="standard-basic"
                            label={'English Type'}
                            variant="standard"
                            helperText={valuesArr.en.type}
                            {...register('typeEn')}
                            required={!valuesArr.en.type}
                        />

                        <TextField
                            fullWidth
                            id="standard-basic"
                            label={'Russian Type'}
                            variant="standard"
                            helperText={valuesArr.ru.type}
                            {...register('typeRu')}
                            required={!valuesArr.ru.type}
                        />

                        <TextField
                            fullWidth
                            id="standard-basic"
                            label={'Armenian Type'}
                            variant="standard"
                            helperText={valuesArr.hy.type}
                            {...register('typeHy')}
                            required={!valuesArr.hy.type}
                        />
                    </div>

                    <div>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            id="standard-basic"
                            label={'English Description'}
                            variant="standard"
                            helperText={valuesArr.en.dis}
                            {...register('disEn')}
                            required={!valuesArr.en.dis}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            id="standard-basic"
                            label={'Russian Description'}
                            variant="standard"
                            helperText={valuesArr.ru.dis}
                            {...register('disRu')}
                            required={!valuesArr.ru.dis}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            id="standard-basic"
                            label={'Armenian Description'}
                            variant="standard"
                            helperText={valuesArr.hy.dis}
                            {...register('disHy')}
                            required={!valuesArr.hy.dis}
                        />
                    </div>
                </div>

                <div className={'actions_btn'}>
                    <Tooltip title="See Preview" onClick={seePreview}>
                        <IconButton>
                            <IconEye/>
                        </IconButton>
                    </Tooltip>

                    {
                        numbersArr.length !== 1 ?
                            <Tooltip title="Delete" onClick={() => {
                                setDeleteLoading(true)
                                setDeleteDialog(true)
                            }}>
                                <IconButton>
                                    {
                                        deleteLoading ? <CircularProgress/> : <IconTrash/>
                                    }
                                </IconButton>
                            </Tooltip>
                            :
                            null
                    }
                </div>
            </div>

            {
                alert ?
                    <Alert severity='success'>{alert}</Alert>
                    :
                    null
            }
            <div className={'form_btns'}>
                <Button variant={'text'} color={'error'} onClick={resetForm}>Reset</Button>
                <VilaButton text={'Save Number'}
                            loadingText={'Saving Number...'} loading={loading}/>
            </div>
        </form>
    )
}

const InfoMapNumber = ({numbersArr, setNumbersArr}) => {
    const {handleSubmit, register, getValues, reset, setValue} = useForm()
    const [numbers, setNumbers] = useState('1')
    const [dialogChange, setDialogChange] = useState(false)

    const addNumber = () => {
        setNumbersArr([...numbersArr, {
            "en": {
                "number": '',
                "type": "",
                "dis": ""
            },
            "ru": {
                "number": '',
                "type": "",
                "dis": ""
            },
            "hy": {
                "number": '',
                "type": "",
                "dis": ""
            }
        }])
    }

    const seePreview = () => {
        const data = getValues()
        const data2 = numbersArr[+numbers - 1]
        numbersArr[+numbers - 1] = {
            "en": {
                "number": data.number ? data.number : data2.en.number,
                "type": data.typeEn ? data.typeEn : data2.en.type,
                "dis": data.disEn ? data.disEn : data2.en.dis
            },
            "ru": {
                "number": data.number ? data.number : data2.ru.number,
                "type": data.typeRu ? data.typeRu : data2.ru.type,
                "dis": data.disRu ? data.disRu : data2.ru.dis
            },
            "hy": {
                "number": data.number ? data.number : data2.hy.number,
                "type": data.typeHy ? data.typeHy : data2.ru.type,
                "dis": data.disHy ? data.disHy : data2.ru.dis
            }
        }

        setNumbersArr([...numbersArr])
    }

    const changeNumbersState = (e, newValue) => {
        const data = getValues()
        const obj1 = {
            "en": {
                "number": '',
                "type": "",
                "dis": ""
            },
            "ru": {
                "number": '',
                "type": "",
                "dis": ""
            },
            "hy": {
                "number": '',
                "type": "",
                "dis": ""
            }
        }
        const obj2 = {
            "en": {
                "number": data.number,
                "type": data.typeEn,
                "dis": data.disEn
            },
            "ru": {
                "number": data.number,
                "type": data.typeRu,
                "dis": data.disRu
            },
            "hy": {
                "number": data.number,
                "type": data.typeHy,
                "dis": data.disHy
            }
        }

        if (numbersArr[+numbers - 1]) {
            if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
                setDialogChange(true)
                setTimeout(() => setDialogChange(false), 5000)
                return
            }
        }

        reset()
        setNumbers(newValue)
    }

    const resetForm = () => {
        reset()
    }

    return (
        <div className={'numbers'}>
            <TabContext value={numbers}>
                <TabList onChange={changeNumbersState} aria-label="lab API tabs example">
                    <Tab value="1" label="Number One"/>
                    <Tab value="2" label="Number Two"/>
                    <Tab value="3" label="Number Three"/>
                </TabList>
                {
                    dialogChange ?
                        <Alert severity="error" style={{marginTop: 15}}>You have unsaved works. Please Save work or
                            Reset</Alert>
                        :
                        null
                }
                <TabPanel value="1"><InfoMapNumberForm setNumbersArr={setNumbersArr} numbersArr={numbersArr} handleSubmit={handleSubmit}
                                                       seePreview={seePreview} valuesArr={numbersArr[0]}
                                                       register={register} resetForm={resetForm}/></TabPanel>
                <TabPanel value="2">
                    {
                        numbersArr[1] ?
                            <InfoMapNumberForm setNumbersArr={setNumbersArr} numbersArr={numbersArr} handleSubmit={handleSubmit}
                                               seePreview={seePreview} valuesArr={numbersArr[1]} register={register}
                                               resetForm={resetForm}/>
                            :
                            <>
                                <p style={{margin: '10px 0 5px', fontSize: 16}}>Don't have this number section</p>
                                <Button variant={'text'} onClick={addNumber}><IconPlus/> Add This Number</Button>
                            </>
                    }
                </TabPanel>
                <TabPanel value="3">

                    {
                        numbersArr[2] ?
                            <InfoMapNumberForm setNumbersArr={setNumbersArr} numbersArr={numbersArr} handleSubmit={handleSubmit}
                                               seePreview={seePreview} valuesArr={numbersArr[2]} register={register}
                                               resetForm={resetForm}/>
                            :
                            <>
                                <p style={{margin: '10px 0 5px', fontSize: 16}}>Don't have this number section</p>
                                <Button variant={'text'} onClick={addNumber}><IconPlus/> Add This Number</Button>
                            </>
                    }
                </TabPanel>
            </TabContext>
        </div>

    )
}

export const InfoMap = () => {
    const {handleSubmit, register, getValues} = useForm()
    const [language, setLanguage] = useState('en')
    const [image, setImage] = useState(null)
    const [imageErrAlert, setImageErrAlert] = useState(null)
    const [imageLoading, setImageLoading] = useState(null)
    const [imageAlert, setImageAlert] = useState(null)
    const [textEditType, setTextEditType] = useState('')
    const [numbersArr, setNumbersArr] = useState([])
    const [titleObj, setTitleObj] = useState({})
    const [titleLoading, setTitleLoading] = useState(false)
    const [titleAlert, setTitleAlert] = useState(false)

    const imageRef = useRef()

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/about/getInfoMap'
        ).then(r => {
            if (!r.data.error) {
                setNumbersArr(r.data.content[0].numbers)
                setTitleObj(r.data.content[0].title)
                setImage(r.data.content[0].image)
            }
        })
    }, [])

    const imgRender = (file) => new Promise((resolve, reject) => {
        const render = new FileReader();
        render.onload = (event) => {
            resolve(event.target.result)
        };
        render.readAsDataURL(file)
    })

    const getImageSize = (srcImg) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve({
                width: this.width,
                height: this.height,
            })
        }
        img.src = srcImg
    })

    const ImageChange = async (file) => {
        if (!file) {
            return
        }

        if (!file[0].type.startsWith('image/')) {
            setImageErrAlert('Image type must be jpg or png')
            imageRef.current.value = ''
            return
        }

        const renderImg = await imgRender(file[0])

        const sizes = await getImageSize(renderImg)

        if (sizes.width >= 1000 && sizes.height >= 400) {
            setImage(renderImg)
            setImageErrAlert(false)
        } else {
            setImageErrAlert('Image size must be min 1000x400 (width, height)')
            imageRef.current.value = ''
        }
    }

    const seePreview = (changedContent, content, setContent) => {
        content[language] = changedContent
        setContent({...content})
    }

    const sendTitle = (data) => {
        setTitleLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoMap?type=title', {
                en: data.titleEn,
                ru: data.titleRu,
                hy: data.titleHy
            }
        ).then(r => {
            if (!r.data.error) {
                setTitleLoading(false)
                setTitleAlert('Title saved')
                setTimeout(() => setTitleAlert(false), 3000)
            }
        })
    }

    const sendImage = () => {
        setImageLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoMap?type=image', {image}
        ).then(r => {
            if (!r.data.error) {
                setImageLoading(false)
                setImageAlert(true)
                setTimeout(() => setImageAlert(false), 3000)
            }
        })
    }

    return (
        <div className={'infoMap'}>
            <h3>Info Map Edit</h3>

            {
                image ?
                    <>
                        <div className={'infoMap__sections'}>
                            <form className={'forms__image'} onSubmit={handleSubmit(sendImage)}>
                                <h5>Upload Image</h5>
                                <p>Image size must be min 1000x400 (width, height)</p>
                                <FileUploadInput onChange={ImageChange} inputRef={imageRef}/>

                                {
                                    imageAlert ?
                                        <Alert severity="success">Image is changed</Alert>
                                        :
                                        null
                                }
                                {
                                    imageErrAlert ?
                                        <Alert severity="error">{imageErrAlert}</Alert>
                                        :
                                        null
                                }

                                <div className={'form_btns'}>
                                    <VilaButton text={'Save Image'} loading={imageLoading}
                                                loadingText={'Saving Image...'}/>
                                </div>
                            </form>

                            <div>
                                <FormControl variant={'standard'} fullWidth>
                                    <InputLabel id="demo-simple-select-label">Text Edit Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={textEditType}
                                        label="Text Edit Type"
                                        onChange={(event) => setTextEditType(event.target.value)}
                                    >
                                        <MenuItem value={'title'}>Title</MenuItem>
                                        <MenuItem value={'numbers'}>Numbers</MenuItem>
                                    </Select>
                                </FormControl>

                                {
                                    textEditType === 'title' ?
                                        <form onSubmit={handleSubmit(sendTitle)}>
                                            <div className={'formInput'}>
                                                <TextField
                                                    fullWidth
                                                    id="standard-basic"
                                                    label={'English'}
                                                    variant="standard"
                                                    defaultValue={titleObj.en}
                                                    {...register('titleEn')}
                                                    required
                                                />

                                                <IconEye
                                                    onClick={() => seePreview(getValues('titleEn'), titleObj, setTitleObj)}/>
                                            </div>
                                            <div className={'formInput'}>
                                                <TextField
                                                    fullWidth
                                                    id="standard-basic"
                                                    label={'Russian'}
                                                    variant="standard"
                                                    defaultValue={titleObj.ru}
                                                    {...register('titleRu')}
                                                    required
                                                />

                                                <IconEye
                                                    onClick={() => seePreview(getValues('titleRu'), titleObj, setTitleObj)}/>
                                            </div>
                                            <div className={'formInput'}>
                                                <TextField
                                                    fullWidth
                                                    id="standard-basic"
                                                    label={'Armenian'}
                                                    variant="standard"
                                                    defaultValue={titleObj.hy}
                                                    {...register('titleHy')}
                                                    required
                                                />

                                                <IconEye
                                                    onClick={() => seePreview(getValues('titleHy'), titleObj, setTitleObj)}/>
                                            </div>

                                            {
                                                titleAlert ?
                                                    <Alert severity="success" style={{marginTop: 15}}>Title Saved</Alert>
                                                    :
                                                    null
                                            }
                                            <div className={'form_btns'}>
                                                <VilaButton text={'Save Title'}
                                                            loadingText={'Saving Title...'} loading={titleLoading}/>
                                            </div>
                                        </form>
                                        :
                                        null
                                }

                                {
                                    textEditType === 'numbers' ?
                                        <InfoMapNumber numbersArr={numbersArr} setNumbersArr={setNumbersArr}/>
                                        :
                                        null
                                }
                            </div>
                        </div>

                        <PreviewTopWithLanguages language={language} setLanguage={setLanguage}/>
                        <div className={'infoMapPreview'}>
                            <section style={{position: 'relative'}}>
                                <img className="achievement-section__bg"
                                     style={{top: 85}}
                                     src={image} alt="img"/>
                                <div className="container achievement-cont" id={"elementAbout"}>
                                    <div className="row bottom-50">
                                        <div className="col-12">
                                            <div className="heading heading--center"><span
                                                className="heading__pre-title">Achievement</span>
                                                <h3 className="heading__title">{titleObj[language]}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row offset-50 justify-content-center" style={{marginTop: 100}}>
                                        {
                                            numbersArr?.map((el, i) => (
                                                <div key={i} className="col-md-6 col-lg-4 text-center">
                                                    <div className="counter counter--blue">
                                                        <div className="counter__top"><span
                                                            className="js-counter counter__count">{el[language].number}</span><span
                                                            className="counter__subject">{el[language].type}</span>
                                                        </div>
                                                        <div className="counter__lower"><span
                                                            className="counter__details">{el[language].dis}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                    :
                    <LinearProgress/>
            }
        </div>
    )
}