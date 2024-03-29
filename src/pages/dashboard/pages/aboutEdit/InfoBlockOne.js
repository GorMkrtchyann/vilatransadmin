import {FileUploadInput} from "../../../../components/fileUploadInput";
import {Alert, FormControl, InputLabel, LinearProgress, MenuItem, Select, Tab, Tabs, TextField} from "@mui/material";
import {VilaButton} from "../../../../components/Button";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {
    IconBold,
    IconBuildingSkyscraper,
    IconCaretDownFilled,
    IconChevronDown,
    IconEye,
    IconPalette
} from "@tabler/icons-react";
import {Editor} from 'react-draft-wysiwyg';
import {BlockPicker} from "react-color";
import {convertFromRaw, convertToRaw,} from 'draft-js';
import EditorState from "draft-js/lib/EditorState";
import draftToHtml from 'draftjs-to-html';
import axios from "axios";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";

const ColorPic = ({expanded, onExpandEvent, onChange, currentState}) => {
    const [open, setOpen] = useState(false)
    const {color} = currentState;

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const onChanging = (color) => {
        onChange('color', color.hex);
    }

    return (
        <div
            aria-haspopup="true"
            aria-expanded={expanded}
            aria-label="rdw-color-picker"
            className={'editorColorPicker_btn'}
            title={'Color'}
        >
            <div
                onClick={() => {
                    onExpandEvent()
                    setOpen(!open)
                }}
                className={'editorBtn'}
                style={{marginLeft: 5}}
            >
                <IconPalette stroke={1.2}/>
            </div>
            {
                open ?
                    <div
                        onClick={stopPropagation}
                        className={'editorColorPicker'}
                    >
                        <BlockPicker color={color} onChangeComplete={onChanging}/>
                    </div>
                    : null
            }
        </div>
    )
}

const InfoBlockOneLanguage = ({error, type, title, setDisText, setLanguage, disText}) => {
    const language = {
        English: 'en',
        Russian: 'ru',
        Armenian: 'hy'
    }

    const content = {
        "entityMap": {},
        "blocks": disText[language[title]].blocks
    }

    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(content)))
    const [open, setOpen] = useState(false)

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        const rawContentState = convertToRaw(newEditorState.getCurrentContent());
        disText[language[title]] = rawContentState
        setDisText({...disText})
    };

    const SeePreview = () => {
        setLanguage(language[title])
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        disText[language[title]] = rawContentState
        setDisText({...disText})
    }

    const toolbarOptions = {
        options: type === 'title' ? ['inline', 'colorPicker'] : ['inline', 'list', 'colorPicker'],
        inline: {
            options: type === 'title' ? ['italic', 'underline', 'strikethrough'] : ['bold', 'italic', 'underline', 'strikethrough'],
            bold: {className: 'editorBtn'},
            italic: {className: 'editorBtn'},
            underline: {className: 'editorBtn'},
            strikethrough: {className: 'editorBtn'},
        },
        list: {
            options: ['ordered', 'unordered'],
            ordered: {className: 'editorBtn'},
            unordered: {className: 'editorBtn'},
        },
        colorPicker: {
            component: ColorPic,
        }
    }


    return (
        <>
            <div className={'infoBlock__forms__accordion'}>
                <div className="infoBlock__forms__accordion__header">
                    <h5>{title}</h5>

                    <div>
                        <IconChevronDown onClick={() => setOpen(!open)}/>
                        <IconEye onClick={SeePreview}/>
                    </div>
                </div>
                {
                    open ?
                        <div className="infoBlock__forms__accordion__section">
                            <Editor
                                wrapperClassName="editor-wrapper"
                                editorClassName="editor-editor"
                                toolbarClassName='editor-toolbar'
                                editorState={editorState}
                                onEditorStateChange={onEditorStateChange}
                                toolbar={toolbarOptions}
                            />
                        </div>
                        :
                        null
                }
            </div>
            {
                error ?
                    <Alert severity="error">{error}</Alert>
                    :
                    null
            }
        </>
    )
}

export const InfoBlockOne = () => {
    const {handleSubmit, register, getValues, reset} = useForm()
    const [imageAlert, setImageAlert] = useState(null)
    const [textsAlert, setTextsAlert] = useState(null)
    const [image, setImage] = useState(null)
    const [imageErrAlert, setImageErrAlert] = useState(null)
    const [imageLoading, setImageLoading] = useState(null)
    const [textsLoading, setTextsLoading] = useState(null)
    const [textEditType, setTextEditType] = useState('')
    const [disText, setDisText] = useState('')
    const [titleText, setTitleText] = useState('')
    const imageRef = useRef()
    const [sloganText, setSloganText] = useState('')
    const [language, setLanguage] = useState('en')
    const [error, setError] = useState({
        en: null,
        ru: null,
        hy: null,
    });

    const convertHtml = (content) => {
        return draftToHtml(content);
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/about/getInfoBlockOne'
        ).then(r => {
            if (!r.data.error) {
                setImageLoading(false)
                setImage(r.data.content[0].image.image)
                setDisText(r.data.content[0].dis)
                setTitleText(r.data.content[0].title)
                setSloganText(r.data.content[0].slogan)
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

        if (sizes.width > 450 && sizes.height > 550) {
            setImage(renderImg)
            setImageErrAlert(false)
        } else {
            setImageErrAlert('Image size must be min 450x550 (width, height)')
            imageRef.current.value = ''
        }
    }

    const UpdateImage = () => {
        setImageLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoBlockOne?type=image', {image}
        ).then(r => {
            if (!r.data.error) {
                setImageAlert(true)
                setImageLoading(false)
                setImage(r.data)
            }
        })
    }

    const UpdateSlogan = (data) => {
        setTextsLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoBlockOne?type=slogan', {
                en: data.sloganEn ? data.sloganEn : sloganText.en,
                ru: data.sloganRu ? data.sloganRu : sloganText.ru,
                hy: data.sloganHy ? data.sloganHy : sloganText.hy,
            }
        ).then(r => {
            if (!r.data.error) {
                reset()
                setTextsAlert(true)
                setTextsLoading(false)
                setSloganText(r.data)
                setTimeout(() => setTextsAlert(false), 2500)
            }
        })


    }

    const UpdateTitle = () => {
        let errorCount = 0
        for (const titleTextKey in titleText) {
            if (titleText[titleTextKey].blocks.text === 'White There' || titleText[titleTextKey].blocks.text === ''){
                errorCount-=1
                error[titleTextKey] = 'Please change content'
                setError({...error})
            }
        }

        if (errorCount < 0) {
            return
        }

        setTextsLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoBlockOne?type=title', {
                ...titleText
            }
        ).then(r => {
            if (!r.data.error) {
                setTextsAlert(true)
                setTextsLoading(false)
                setTitleText(r.data)
                setTimeout(() => setTextsAlert(false), 2500)
            }
        })
    }

    const UpdateDis = () => {
        let errorCount = 0
        for (const disTextKey in disText) {
            if (disText[disTextKey].blocks[0].text === 'White There' || disText[disTextKey].blocks[0].text === ''){
                errorCount-=1
                error[disTextKey] = 'Please change content'
                setError({...error})
            }
        }

        if (errorCount < 0) {
            return
        }

        setTextsLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/about/updateInfoBlockOne?type=dis', {
                ...disText
            }
        ).then(r => {
            if (!r.data.error) {
                setTextsAlert(true)
                setTextsLoading(false)
                setDisText(r.data)
                setTimeout(() => setTextsAlert(false), 2500)
            }
        })
    }

    const seeSlogan = (text) => {
        sloganText[language] = text
        setSloganText({...sloganText})
    }

    return (
        <div className={'infoBlock'}>
            <h3>Edit Info Block 1</h3>

            {
                image ?
                    <>
                        <div className={'infoBlock__forms'}>
                            <form className={'infoBlock__forms__image'} onSubmit={handleSubmit(UpdateImage)}>
                                <h5>Upload Image</h5>
                                <p>Image size must be min 450x550 (width, height)</p>
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
                                <FormControl variant={'standard'} fullWidth style={{marginBottom: 20}}>
                                    <InputLabel id="demo-simple-select-label">Text Edit Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={textEditType}
                                        label="Text Edit Type"
                                        onChange={(event) => setTextEditType(event.target.value)}
                                    >
                                        <MenuItem value={'slogan'}>Slogan</MenuItem>
                                        <MenuItem value={'description'}>Description</MenuItem>
                                        <MenuItem value={'title'}>Title</MenuItem>
                                    </Select>
                                </FormControl>
                                {
                                    textEditType === 'slogan' ? <form onSubmit={handleSubmit(UpdateSlogan)}>
                                        <div className={'formInput'}>
                                            <TextField
                                                fullWidth
                                                id="standard-basic"
                                                label={'English'}
                                                variant="standard"
                                                {...register('sloganEn')}
                                                required
                                            />

                                            <IconEye onClick={() => seeSlogan(getValues('sloganEn'))}/>
                                        </div>
                                        <div className={'formInput'}>
                                            <TextField
                                                fullWidth
                                                id="standard-basic"
                                                label={'Russian'}
                                                variant="standard"
                                                {...register('sloganRu')}
                                                required
                                            />

                                            <IconEye onClick={() => seeSlogan(getValues('sloganRu'))}/>
                                        </div>
                                        <div className={'formInput'}>
                                            <TextField
                                                fullWidth
                                                id="standard-basic"
                                                label={'Armenian'}
                                                variant="standard"
                                                {...register('sloganHy')}
                                                required
                                            />

                                            <IconEye onClick={() => seeSlogan(getValues('sloganHy'))}/>
                                        </div>

                                        <div className={'form_btns'}>
                                            <VilaButton text={'Save Slogan'} loading={textsLoading}
                                                        loadingText={'Saving Slogan...'}/>
                                        </div>
                                    </form> : null
                                }

                                {
                                    textEditType === 'description' ? <form onSubmit={handleSubmit(UpdateDis)}>

                                        <InfoBlockOneLanguage error={error.en} setLanguage={setLanguage} type={'dis'} title={'English'} setDisText={setDisText}
                                                              disText={disText}/>
                                        <InfoBlockOneLanguage error={error.ru} setLanguage={setLanguage} type={'dis'} title={'Russian'} setDisText={setDisText}
                                                              disText={disText}/>
                                        <InfoBlockOneLanguage error={error.hy} setLanguage={setLanguage} type={'dis'} title={'Armenian'} setDisText={setDisText}
                                                              disText={disText}/>

                                        <div className={'form_btns'}>
                                            <VilaButton text={'Save Description'} loading={textsLoading}
                                                        loadingText={'Saving Description...'}/>
                                        </div>
                                    </form> : null
                                }

                                {
                                    textEditType === 'title' ? <form onSubmit={handleSubmit(UpdateTitle)}>

                                        <InfoBlockOneLanguage error={error.en} setLanguage={setLanguage} type={'title'} title={'English'} setDisText={setTitleText}
                                                              disText={titleText}/>
                                        <InfoBlockOneLanguage error={error.ru} setLanguage={setLanguage} type={'title'} title={'Russian'} setDisText={setTitleText}
                                                              disText={titleText}/>
                                        <InfoBlockOneLanguage error={error.hy} setLanguage={setLanguage} type={'title'} title={'Armenian'}
                                                              setDisText={setTitleText}
                                                              disText={titleText}/>

                                        <div className={'form_btns'}>
                                            <VilaButton text={'Save Title'} loading={textsLoading}
                                                        loadingText={'Saving Title...'}/>
                                        </div>
                                    </form> : null
                                }

                                {
                                    textsAlert ?
                                        <Alert severity="success">The change is complete</Alert>
                                        :
                                        null
                                }
                            </div>
                        </div>

                        <PreviewTopWithLanguages language={language} setLanguage={setLanguage}/>
                        <div className={'infoBlockPreview'}>
                            <div className="row">
                                <div className="col-lg-6 col-xl-5">
                                    <img className="w-100 bottom-50" src={image} alt="img"/>
                                    <div className="img-badge">
                                        <img className="img-badge__img"
                                             src="https://vilatrans.vercel.app/img/badge-img.png" alt="img"/>
                                        <h3 className="img-badge__title bottom-0"
                                            style={{color: 'white'}}>{sloganText[language]}</h3>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xl-6 offset-xl-1">
                                    <div className="heading bottom-20">
                                        <span className="heading__pre-title">About us</span>
                                        <h3 className="heading__title" dangerouslySetInnerHTML={{__html: convertHtml(titleText[language]).slice(3, -5)}}/>
                                    </div>
                                    <div dangerouslySetInnerHTML={{__html: convertHtml(disText[language]) }}/>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <LinearProgress/>

            }
        </div>
    )
}