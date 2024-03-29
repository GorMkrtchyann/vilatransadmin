import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Alert, LinearProgress, Tab, Tabs, TextField} from "@mui/material";
import {IconChevronDown, IconEye, IconMail, IconPalette, IconPhoto, IconTextSize, IconX} from "@tabler/icons-react";
import {VilaButton} from "../../../../components/Button";
import {BlockPicker, TwitterPicker} from "react-color";
import {Editor} from 'react-draft-wysiwyg';
import {convertFromRaw, convertToRaw} from "draft-js";
import EditorState from "draft-js/lib/EditorState";
import draftToHtml from "draftjs-to-html";
import {useForm} from "react-hook-form";
import {FileUploadInput} from "../../../../components/fileUploadInput";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";
import axios from "axios";
import {useNavigate} from "react-router";
import {DeleteDialog} from "../../../../components/deleteDialog";

const ColorPic = ({expanded, onExpandEvent, onChange, config, currentState}) => {
    const [open, setOpen] = useState(false)

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const onChanging = (color) => {
        onChange('color', color.hex);
        setOpen(false)
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
                style={{marginLeft: 5, marginRight: 5}}
            >
                <IconPalette stroke={1.2}/>
            </div>
            {
                open ?
                    <div
                        onClick={stopPropagation}
                        className={'editorColorPicker'}
                    >
                        <BlockPicker
                            color={currentState.color}
                            colors={config.colors}
                            onChangeComplete={onChanging}
                        />
                    </div>
                    : null
            }
        </div>
    )
}

const ImageUpload = ({expanded, onExpandEvent, onChange, currentState}) => {
    const [open, setOpen] = useState(false)
    const inputRef = useRef()
    const render = (file) => new Promise((resolve, reject) => {
        const render = new FileReader();
        render.onload = (event) => {
            resolve(event.target.result)
        };
        render.readAsDataURL(file)
    })

    const onChanging = async (file) => {
        if (file) {
            if (file[0].type.startsWith('image/')){
                const image = await render(file[0])
                onChange(image);
            }
        }
    }

    return (
        <div
            aria-haspopup="true"
            aria-expanded={expanded}
            aria-label="rdw-image-control"
            className={'editorColorPicker_btn'}
            title={'Image'}
        >
            <div
                onClick={() => {
                    onExpandEvent()
                    inputRef.current.click()
                }}
                className={'editorBtn'}
                style={{marginLeft: 5, marginRight: 5}}
            >
                <IconPhoto stroke={1.3} size={21}/>
            </div>
            <input type="file" ref={inputRef} style={{display: 'none'}} onChange={(e) => onChanging(e.target.files)}/>
        </div>
    )
}

const BlockType = (props) => {
    const [open, setOpen] = useState(false)
    const {blockType} = props.currentState;
    const values = props.config.options

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const onChanging = (text) => {
        props.onChange(text);
        setOpen(false)
    }

    return (
        <div
            aria-haspopup="true"
            aria-expanded={props.expanded}
            aria-label="rdw-block-control"
            className={'editor_selectBth'}
            title={'Block Control'}
        >
            <div
                onClick={() => {
                    props.onExpandEvent()
                    setOpen(!open)
                }}
                className={'selectBth'}
                style={{marginLeft: 5, marginRight: 5}}
            >
                <p>{blockType}</p>
                <IconChevronDown size={16}/>
            </div>
            {
                open ?
                    <div
                        onClick={stopPropagation}
                        className={'editor_select'}
                    >
                        {
                            values?.map(el => (
                                <p key={el} onClick={() => onChanging(el)}>{el}</p>
                            ))
                        }
                    </div>
                    : null
            }
        </div>
    )
}

const FontSize = (props) => {
    const [open, setOpen] = useState(false)
    const {fontSize} = props.currentState;
    const values = props.config.options

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const onChanging = (text) => {
        props.onChange(text);
        setOpen(false)
    }

    return (
        <div
            aria-haspopup="true"
            aria-expanded={props.expanded}
            aria-label="rdw-font-size-control"
            className={'editor_selectBth'}
            title={'Font Size'}
        >
            <div
                onClick={() => {
                    props.onExpandEvent()
                    setOpen(!open)
                }}
                className={'selectBth'}
                style={{marginLeft: 5, marginRight: 5}}
            >
                {
                    fontSize ?
                        <p>{fontSize}</p>
                        :
                        <IconTextSize stroke={1.5} size={21}/>

                }
                <IconChevronDown size={16}/>
            </div>
            {
                open ?
                    <div
                        onClick={stopPropagation}
                        className={'editor_select'}
                    >
                        {
                            values?.map(el => (
                                <p key={el} onClick={() => onChanging(el)}>{el}</p>
                            ))
                        }
                    </div>
                    : null
            }
        </div>
    )
}

const ContentEditor = ({setContentObj, contentObj}) => {
    const [language, setLanguage] = useState('en')
    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw({...contentObj[language], entityMap: contentObj[language].entityMap ? contentObj[language].entityMap : {}})))
    const [htmlContent, setHtmlContent] = useState({...contentObj[language], "entityMap": contentObj[language].entityMap ? contentObj[language].entityMap : {}})

    const toolbarOptions = {
        options: ['inline', 'blockType', 'fontSize', 'textAlign', 'list', 'colorPicker', 'image', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline'],
            bold: {className: 'editorBtn'},
            italic: {className: 'editorBtn'},
            underline: {className: 'editorBtn'},
            strikethrough: {className: 'editorBtn'},
        },
        blockType: {
            component: BlockType,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
        },
        fontSize: {
            component: FontSize,
            fontSize: 12,
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        },
        textAlign: {
            inDropdown: false,
            className: undefined,
            options: ['left', 'center', 'right', 'justify'],
            left: {className: 'editorBtn'},
            center: {className: 'editorBtn'},
            right: {className: 'editorBtn'},
            justify: {className: 'editorBtn'},
        },
        list: {
            options: ['ordered', 'unordered'],
            ordered: {className: 'editorBtn'},
            unordered: {className: 'editorBtn'},
        },
        colorPicker: {
            component: ColorPic,
            colors: ['#61bd6d', '#1abc9c', '#54acd2', '#2c82c9',
                '#9365b8', '#475577', '#cccccc', '#41a85f', '#00a885',
                '#3d8eb9', '#2969b0', '#553982', '#28324e', '#000000',
                '#f7da64', '#fba026', '#eb6b56', '#e25041', '#a38f84',
                '#efefef', '#ffffff', '#fac51c', '#f37934', '#d14841',
                '#b8312f', '#7c706b', '#d1d5d8']
        },
        image: {
            component: ImageUpload,
            className: 'editorBtn',
            uploadEnabled: true,
            alignmentEnabled: true,
            previewImage: false,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: {present: false, mandatory: false},
            defaultSize: {
                height: 'auto',
                width: '100px',
            },
        },
        history: {
            inDropdown: false,
            options: ['undo', 'redo'],
            undo: {className: 'editorBtn'},
            redo: {className: 'editorBtn'},
        },
    }

    const languageChange = (_, newValue) => {
        setLanguage(newValue)
        setEditorState(EditorState.createWithContent(convertFromRaw({...contentObj[newValue], "entityMap": contentObj[newValue].entityMap ? contentObj[newValue].entityMap : {}})))
        setHtmlContent({...contentObj[newValue], "entityMap": contentObj[newValue].entityMap ? contentObj[newValue].entityMap : {}})
    }

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        const rawContentState = convertToRaw(newEditorState.getCurrentContent());
        contentObj[language] = {...rawContentState}
        setContentObj({...contentObj})
        setHtmlContent({...rawContentState})
    };

    return (
        <>
            <Tabs
                value={language}
                onChange={languageChange}
                aria-label="secondary tabs example"
                style={{marginBottom: 10}}
            >
                <Tab value="en" label="English"/>
                <Tab value="ru" label="Russian"/>
                <Tab value="hy" label="Armenian"/>
            </Tabs>

            <div className={'singlePage__content'}>
                <div className="singlePage__content__editor">
                    <Editor
                        wrapperClassName="editor-wrapper"
                        editorClassName="editor-editor"
                        toolbarClassName='editor-toolbar'
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        toolbar={toolbarOptions}
                    />
                </div>

                <div className="singlePage__content__preview" dangerouslySetInnerHTML={{__html: draftToHtml(htmlContent)}}>

                </div>
            </div>
        </>
    )

}

const BannersEdit = ({previewElem, title, img, customSubmit, newForm, haveButton = true, setBanner}) => {
    const {handleSubmit} = useForm()
    const [image, setImage] = useState(img)
    const [alert, setAlert] = useState(false)
    const [alertErr, setAlertErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef()

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
        if (!file[0].type.startsWith('image/')) {
            setAlertErr('Image type must be jpg or png')
            inputRef.current.value = ''
            return
        }

        const renderImg = await imgRender(file[0])

        const sizes = await getImageSize(renderImg)

        if (sizes.width === 1920 && sizes.height === 1080) {
            setImage(renderImg)
            setBanner(renderImg)
            setAlertErr(false)
        } else {
            setAlertErr('Image size must be 1920x1080 (width, height)')
            setBanner(null)
            inputRef.current.value = ''
        }

    }

    const Submit = async () => {
        setLoading(true)
        const sending = await customSubmit(image)

        if (!sending.data.error) {
            setAlert(true)
            setLoading(false)
            inputRef.current.value = ''
        } else {
            setAlertErr('Error from request')
        }
    }

    return (
        <div className={'bannerEdit'}>
            <div style={{display: "flex", gap: 30, marginBottom: 20}}>
                <form onSubmit={handleSubmit(Submit)}>
                    <h5>Banner Image</h5>
                    <p>1920x1080 (width, height)</p>
                    <FileUploadInput onChange={ImageChange} inputRef={inputRef}/>

                    {
                        alert ?
                            <Alert severity="success">Image is changed</Alert>
                            :
                            null
                    }
                    {
                        alertErr ?
                            <Alert severity="error">{alertErr}</Alert>
                            :
                            null
                    }

                    {
                        haveButton ?
                            <div className={'officesInfo__form__btns'}>
                                <VilaButton text={'Save Image'} loading={loading} loadingText={'Saving Image...'}/>
                            </div>
                            :
                            null

                    }
                </form>
                {newForm}
            </div>

            {previewElem}
            {
                image ?
                    <div className="bannerEdit__preview">
                        <img src={image} alt=""/>
                        <div className={'bannerEdit__preview__gradient'}/>
                        <div className="bannerEdit__preview__text">
                            <b>{title}</b>
                            <span>Vila Trans</span>
                        </div>
                    </div>
                    :
                    <LinearProgress/>
            }

        </div>
    )
}

export const AddSingleService = ({setChangePage, AddSubmit, editPage}) => {
    const {handleSubmit, register, getValues} = useForm()
    const [typeValue, setTypeValue] = useState('1')
    const [title, setTitle] = useState(editPage ? editPage.title : {
        en: null,
        ru: null,
        hy: null
    })
    const [contentObj, setContentObj] = useState(editPage ? editPage.content :{
        en: {
            "entityMap": {},
            "blocks": [
                {
                    "key": "637gr",
                    "text": "Start There!!",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }
            ],
        },
        ru: {
            "entityMap": {},
            "blocks": [
                {
                    "key": "637gr",
                    "text": "Start There Ru",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }
            ],
        },
        hy: {
            "entityMap": {},
            "blocks": [
                {
                    "key": "637gr",
                    "text": "Start There Hy",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                }
            ],
        }
    })
    const [banner, setBanner] = useState(editPage ? editPage.banner : null)
    const [stepError, setStepError] = useState(false)
    const [language, setLanguage] = useState('en')
    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [dialogClose, setDialogClose] = useState(false)

    const nextStep = (data) => {
        setTitle(data)
        if (banner) {
            setTypeValue('2')
        } else {
            setStepError(true)
            setTimeout(() => setStepError(false), 6000)
        }
    }

    const Submit = async () => {
        const titleObj = getValues()
        setLoading(true)
        const add = await AddSubmit(banner, titleObj, contentObj)

        if (!add.data.error){
            setLoading(false)
            setChangePage(true)
        }
    }

    const seeTitlePreview = (lang, value) => {
        title[lang] = value
        setTitle({...title})
        setLanguage(lang)
    }

    return (
        <div>
            {
                dialog ?
                    <DeleteDialog text={'Are you sure you have completed the work?'} setOpen={setDialog} onDelete={Submit}/>
                    :
                    null
            }

            {
                dialogClose ?
                    <DeleteDialog text={'Are you sure want close tab?'} setOpen={setDialogClose} onDelete={() => setChangePage(true)}/>
                    :
                    null
            }
            <h4 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {editPage ? `Update ${title.en}` : 'Add New Single Service Page'} <IconX onClick={() => setDialogClose(true)} style={{cursor: "pointer"}}/>
            </h4>

            {
                stepError ?
                    <Alert severity="error">Please add image and title</Alert>
                    :
                    null
            }

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <Tabs
                    value={typeValue}
                    onChange={(_, newValue) => {
                        if (banner && title.en && title.ru && title.hy) {
                            setTypeValue(newValue)
                        } else {
                            setStepError(true)
                            setTimeout(() => setStepError(false), 6000)
                        }
                    }}
                    aria-label="secondary tabs example"
                >
                    <Tab value="1" label="Banner"/>
                    <Tab value="2" label="Content"/>
                </Tabs>

                {
                    typeValue === '2' ?
                        <div className={'officesInfo__form__btns'}>
                            <VilaButton loading={loading} onClick={() => setDialog(true)} text={`${editPage ? 'Update' : 'Add'} Page`} loadingText={`${editPage ? 'Updating' : 'Adding'} Page...`}/>
                        </div>
                        :
                        null
                }
            </div>

            {
                typeValue === '1' ?
                    <>
                        <BannersEdit
                            title={title[language]}
                            img={banner ? banner : 'https://demo.artureanec.com/html/transx/img/service-details.jpg'}
                            haveButton={false}
                            setBanner={setBanner}
                            previewElem={<PreviewTopWithLanguages language={language} setLanguage={setLanguage}/>}
                            newForm={
                                <form style={{marginLeft: 20}} onSubmit={handleSubmit(nextStep)}>
                                    <h5>Title</h5>

                                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={'English'}
                                            variant="standard"
                                            defaultValue={title.en}
                                            {...register('en')}
                                            required
                                        />

                                        <IconEye style={{cursor: "pointer"}} onClick={() => seeTitlePreview('en', getValues('en'))}/>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={'Russian'}
                                            variant="standard"
                                            defaultValue={title.ru}
                                            {...register('ru')}
                                            required
                                        />

                                        <IconEye style={{cursor: "pointer"}} onClick={() => seeTitlePreview('ru', getValues('ru'))}/>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={'Armenian'}
                                            variant="standard"
                                            defaultValue={title.hy}
                                            {...register('hy')}
                                            required
                                        />

                                        <IconEye style={{cursor: "pointer"}} onClick={() => seeTitlePreview('hy', getValues('hy'))}/>
                                    </div>

                                    <div className={'officesInfo__form__btns'}>
                                        <VilaButton text={'Next Step'}/>
                                    </div>
                                </form>
                            }
                        />
                    </>
                    :
                    <ContentEditor contentObj={contentObj} setContentObj={setContentObj}/>

            }
        </div>
    )
}