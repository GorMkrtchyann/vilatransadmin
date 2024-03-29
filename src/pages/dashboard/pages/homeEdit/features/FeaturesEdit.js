import React, {useEffect, useRef, useState} from 'react';
import FeaturesEditReview from "./FeaturesEditReview";
import '../../../../../assets/styles/features.scss';
import {FileUploadInput} from "../../../../../components/fileUploadInput";
import {VilaButton} from "../../../../../components/Button";
import {Alert, LinearProgress, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import OutlinedAlerts from "../ErrorAlert";
import axios from "axios";
import {convertFromRaw, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {AccordionUsage} from "../EditorAccordions";
import ControlledOpenDescSelect from "./DescSection";
import BasicFeaturesTabs from "./SectionControll";


const Icon = ({iconUpload, iconInputRef1, iconInputRef2, iconInputRef3, setIcon1, setIcon2, setIcon3, setIconError1,setIconError2, setIconError3, iconImg1, iconImg2, iconImg3, error1, error2, error3, reqData}) => {
    return <>
        <div>
            <p>Icon dimensions must be 60x60.</p>
            <FileUploadInput
                onChange={(e) => iconUpload(e, iconInputRef1, setIcon1, setIconError1)}
                text={'Upload Icon 1'}
                inputRef={iconInputRef1}
                required={false}
            />

            {iconImg1 ? <div className={'icon-box'}><img src={iconImg1} alt="img"/></div> : (reqData ? <div className={'icon-box'}><img src={reqData.section1.icon} alt="img"/></div> : null)}
            {error1 ? <div className={'error-box'}><OutlinedAlerts message={error1}/></div> : null}
        </div>
        <div>
            <p>Icon dimensions must be 60x60.</p>
            <FileUploadInput
                onChange={(e) => iconUpload(e, iconInputRef2, setIcon2, setIconError2)}
                text={'Upload Icon 2'}
                inputRef={iconInputRef2}
                required={false}
            />
            {iconImg2 ? <div className={'icon-box'}><img src={iconImg2} alt="img"/></div> : (reqData ? <div className={'icon-box'}><img src={reqData.section2.icon} alt="img"/></div> : null)}
            {error2 ? <div className={'error-box'}><OutlinedAlerts message={error2}/></div> : null}
        </div>
        <div>
            <p>Icon dimensions must be 60x60.</p>
            <FileUploadInput
                onChange={(e) => iconUpload(e, iconInputRef3, setIcon3, setIconError3)}
                text={'Upload Icon 3'}
                inputRef={iconInputRef3}
                required={false}
            />
            {iconImg3 ? <div className={'icon-box'}><img src={iconImg3} alt="img"/></div> : (reqData ? <div className={'icon-box'}><img src={reqData.section3.icon} alt="img"/></div> : null)}
            {error3 ? <div className={'error-box'}><OutlinedAlerts message={error3}/></div> : null}
        </div>
    </>
}

const Title = ({register, reqData}) => {
    return <>
        <div>
            <h6>Title 1</h6>
            <TextField
                name="title-en"
                id="standard-basic"
                label="English"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section1.title.en : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60, }}
                {...register('secondTitleEn1')}
            />

            <TextField
                name="title-ru"
                id="standard-basic"
                label="Russian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section1.title.ru : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleRu1')}
            />

            <TextField
                name="title-am"
                id="standard-basic"
                label="Armenian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section1.title.en : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleHy1')}
            />
        </div>
        <div>
            <h6>Title 2</h6>
            <TextField
                name="title-en"
                id="standard-basic"
                label="English"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section2.title.en : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60, }}
                {...register('secondTitleEn2')}
            />

            <TextField
                name="title-ru"
                id="standard-basic"
                label="Russian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section2.title.ru : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleRu2')}
            />

            <TextField
                name="title-am"
                id="standard-basic"
                label="Armenian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section2.title.hy : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleHy2')}
            />
        </div>
        <div>
            <h6>Title 3</h6>
            <TextField
                name="title-en"
                id="standard-basic"
                label="English"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section3.title.en : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60, }}
                {...register('secondTitleEn3')}
            />

            <TextField
                name="title-ru"
                id="standard-basic"
                label="Russian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section3.title.ru : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleRu3')}
            />

            <TextField
                name="title-am"
                id="standard-basic"
                label="Armenian"
                variant="standard"
                multiline
                required={true}
                defaultValue={reqData ? reqData.section3.title.hy : ''}
                focused={!!reqData}
                inputProps={{ maxLength: 60 }}
                {...register('secondTitleHy3')}
            />
        </div>
    </>
}

const Description = ({setRawData, editedRaw, descError}) => {
    const [section, setSection] = useState('section 1');
    const [elems, setElems] = useState(null);

    const [editorStates, setEditorStates] = useState({
        en1: EditorState.createEmpty(),
        ru1: EditorState.createEmpty(),
        hy1: EditorState.createEmpty(),
        en2: EditorState.createEmpty(),
        ru2: EditorState.createEmpty(),
        hy2: EditorState.createEmpty(),
        en3: EditorState.createEmpty(),
        ru3: EditorState.createEmpty(),
        hy3: EditorState.createEmpty(),
    });

    const onEditorStateChange = (newEditorState, key) => {
        setEditorStates(prevStates => ({
            ...prevStates,
            [key]: newEditorState,
        }));

        const rawContentState = convertToRaw(newEditorState.getCurrentContent());

        setRawData(prevContents => ({
            ...prevContents,
            [key]: rawContentState,
        }))
    };

    useEffect(() => {
        setEditorStates(editedRaw);
    }, [])

    useEffect(() => {

        switch (section) {
            case 'section 1':
                return setElems(
                    <div className={'desc-fields'}>
                        <div>
                            <AccordionUsage text={'English'}
                                            editorState={editorStates.en1}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'en1'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Russian'}
                                            editorState={editorStates.ru1}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'ru1'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Armenian'}
                                            editorState={editorStates.hy1}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'hy1'}/>
                        </div>
                    </div>
                )
            case 'section 2':
                return setElems(
                    <div className={'desc-fields'}>
                        <div>
                            <AccordionUsage text={'English'}
                                            editorState={editorStates.en2}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'en2'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Russian'}
                                            editorState={editorStates.ru2}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'ru2'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Armenian'}
                                            editorState={editorStates.hy2}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'hy2'}/>
                        </div>
                    </div>
                )
            case 'section 3':
                return setElems(
                    <div className={'desc-fields'}>
                        <div>
                            <AccordionUsage text={'English'}
                                            editorState={editorStates.en3}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'en3'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Russian'}
                                            editorState={editorStates.ru3}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'ru3'}/>
                        </div>

                        <div>
                            <AccordionUsage text={'Armenian'}
                                            editorState={editorStates.hy3}
                                            onEditorStateChange={onEditorStateChange}
                                            lang={'hy3'}/>
                        </div>
                    </div>
                )
        }
    }, [section, editorStates])

    return <div className={'desc-area'}>
        <ControlledOpenDescSelect section={section} setSection={setSection}/>
        {descError ? <OutlinedAlerts message={descError}/> : null}
        {elems}
    </div>
}


export const FeaturesEdit = () => {
    const [reqData, setReqData] = useState(null);
    const {handleSubmit, register} = useForm();
    const [type, setType] = useState('icon');
    const [element, setElement] = useState(null);
    const [image, setImage] = useState('');
    const [icon1, setIcon1] = useState('');
    const [icon2, setIcon2] = useState('');
    const [icon3, setIcon3] = useState('');
    const [error, setError] = useState('');
    const [descError, setDescError] = useState('');
    const [errorIcon1, setErrorIcon1] = useState('');
    const [errorIcon2, setErrorIcon2] = useState('');
    const [errorIcon3, setErrorIcon3] = useState('');
    const iconInputRef1 = useRef(null);
    const iconInputRef2 = useRef(null);
    const iconInputRef3 = useRef(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState({
        en1: {},
        ru1: {},
        hy1: {},
        en2: {},
        ru2: {},
        hy2: {},
        en3: {},
        ru3: {},
        hy3: {},
    });
    const [htmlContents, setHtmlContents] = useState({
        en1: '',
        ru1: '',
        hy1: '',
        en2: '',
        ru2: '',
        hy2: '',
        en3: '',
        ru3: '',
        hy3: '',
    });
    const [editedRaw, setEditedRaw] = useState(null);
    const [language, setLanguage] = useState('en')
    const [alert, setAlert] = useState(false)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/home/get-features').then(res => {
            if (res.data) {
                const desc1 = res.data.section1.description;
                const desc2 = res.data.section2.description;
                const desc3 = res.data.section3.description;

                setReqData(res.data);
                // setType('icon');
                setEditedRaw({
                    en1: EditorState.createWithContent(convertFromRaw({...desc1.en, entityMap: {}})),
                    ru1: EditorState.createWithContent(convertFromRaw({...desc1.ru, entityMap: {}})),
                    hy1: EditorState.createWithContent(convertFromRaw({...desc1.hy, entityMap: {}})),
                    en2: EditorState.createWithContent(convertFromRaw({...desc2.en, entityMap: {}})),
                    ru2: EditorState.createWithContent(convertFromRaw({...desc2.ru, entityMap: {}})),
                    hy2: EditorState.createWithContent(convertFromRaw({...desc2.hy, entityMap: {}})),
                    en3: EditorState.createWithContent(convertFromRaw({...desc3.en, entityMap: {}})),
                    ru3: EditorState.createWithContent(convertFromRaw({...desc3.ru, entityMap: {}})),
                    hy3: EditorState.createWithContent(convertFromRaw({...desc3.hy, entityMap: {}})),
                });

                setRawData({
                    en1: {...desc1.en, entityMap: {}},
                    ru1: {...desc1.ru, entityMap: {}},
                    hy1: {...desc1.hy, entityMap: {}},
                    en2: {...desc2.en, entityMap: {}},
                    ru2: {...desc2.ru, entityMap: {}},
                    hy2: {...desc2.hy, entityMap: {}},
                    en3: {...desc3.en, entityMap: {}},
                    ru3: {...desc3.ru, entityMap: {}},
                    hy3: {...desc3.hy, entityMap: {}}
                });
            }
        })
    }, []);

    useEffect(() => {
        setHtmlContents({
            en1: draftToHtml(rawData.en1),
            ru1: draftToHtml(rawData.ru1),
            hy1: draftToHtml(rawData.hy1),
            en2: draftToHtml(rawData.en2),
            ru2: draftToHtml(rawData.ru2),
            hy2: draftToHtml(rawData.hy2),
            en3: draftToHtml(rawData.en3),
            ru3: draftToHtml(rawData.ru3),
            hy3: draftToHtml(rawData.hy3),
        })
    }, [reqData])
    const fileRender = (file) => new Promise((resolve, reject) => {
        const render = new FileReader();
        render.onload = (event) => {
            resolve(event.target.result);

        };
        render.onerror = (err) => reject(err);
        render.readAsDataURL(file);
    })

    const getImageSize = (srcImg) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            resolve({
                width: this.width,
                height: this.height,
            })
        }
        img.src = srcImg
    })

    const fileUpload = async (fileObj) => {
        const file = fileObj[0]

        if (file) {
            if (file.type.startsWith('image/')) {
                const renderImage = await fileRender(file);
                const getSizes = await getImageSize(renderImage);

                if (getSizes.width < 1920 || getSizes.height < 850) {
                    setError('Image dimensions must be minimum 1920x850.');
                    setTimeout(() => setError(false), 5000)
                    fileInputRef.current.value = null;
                    setImage(null);
                    return
                } else {
                    setError('');
                }
                setImage(renderImage);
            } else {
                setError('Invalid file type.')
            }
        } else {
            fileInputRef.current.value = null;
            setImage(null);
        }
    }

    const iconUpload = async (fileObj, iconRef, setIcon, setIconError) => {
        const file = fileObj[0]

        if (file) {
            if (file.type.startsWith('image/')) {
                const renderImage = await fileRender(file);
                const getSizes = await getImageSize(renderImage);

                if (getSizes.width !== 60 || getSizes.height !== 60) {
                    setIconError('Image dimensions must be 60x60.');
                    iconRef.current.value = null;
                    setIcon(null);
                    return
                } else {
                    setIconError('');
                }
                setIcon(renderImage);
            } else {
                setIconError('Invalid file type.');
            }
        } else {
            iconRef.current.value = null;
            setIcon(null);
        }
    }

    const Submit = async (data) => {
        const isEmptyField = (object) => {
            for(let key in object) {
                if (object[key].blocks[0].text.trim() === '') {
                    return true
                }
            }
            return false
        }

        const sendingData = {
            id: reqData._id ? reqData._id : '',
            image: image ? image : reqData.image,
            title: {
                hy: data.titleHy ? data.titleHy : reqData.title.hy,
                ru: data.titleRu ? data.titleRu : reqData.title.ru,
                en: data.titleEn ? data.titleEn : reqData.title.en
            },
            section1: {
                icon: icon1 ? icon1 : reqData.section1.icon,
                title: {
                    hy: data.secondTitleHy1 ? data.secondTitleHy1 : reqData.section1.title.hy,
                    ru: data.secondTitleRu1 ? data.secondTitleRu1 : reqData.section1.title.ru,
                    en: data.secondTitleEn1 ? data.secondTitleEn1 : reqData.section1.title.en
                },
                description: {
                    hy: rawData.hy1 ? rawData.hy1 : reqData.section1.description.hy,
                    ru: rawData.ru1 ? rawData.ru1 : reqData.section1.description.ru,
                    en: rawData.en1 ? rawData.en1 : reqData.section1.description.en
                }
            },
            section2: {
                icon: icon2 ? icon2 : reqData.section2.icon,
                title: {
                    hy: data.secondTitleHy2 ? data.secondTitleHy2 : reqData.section2.title.hy,
                    ru: data.secondTitleRu2 ? data.secondTitleRu2 : reqData.section2.title.ru,
                    en: data.secondTitleEn2 ? data.secondTitleEn2 : reqData.section2.title.en
                },
                description: {
                    hy: rawData.hy2 ? rawData.hy2 : reqData.section2.description.hy,
                    ru: rawData.ru2 ? rawData.ru2 : reqData.section2.description.ru,
                    en: rawData.en2 ? rawData.en2 : reqData.section2.description.en
                }
            },
            section3: {
                icon: icon3 ? icon3 : reqData.section3.icon,
                title: {
                    hy: data.secondTitleHy3 ? data.secondTitleHy3 : reqData.section3.title.hy,
                    ru: data.secondTitleRu3 ? data.secondTitleRu3 : reqData.section3.title.ru,
                    en: data.secondTitleEn3 ? data.secondTitleEn3 : reqData.section3.title.en
                },
                description: {
                    hy: rawData.hy3 ? rawData.hy3 : reqData.section3.description.hy,
                    ru: rawData.ru3 ? rawData.ru3 : reqData.section3.description.ru,
                    en: rawData.en3 ? rawData.en3 : reqData.section3.description.en
                }
            },
        }

        //check fields//
        if (isEmptyField(sendingData.section1.description) || isEmptyField(sendingData.section2.description) || isEmptyField(sendingData.section3.description)) {
            return setDescError('Please fill in all fields.');
        }

        setDescError('');
        setLoading(true);

        const res = await axios.put(process.env.REACT_APP_NODE_API + '/home/update-features', sendingData);

        if (res.data) {
            setLoading(false);
            setReqData(res.data);
            setAlert(true)
            setTimeout(() => setAlert(false), 5000)
        }
    }

    useEffect(() => {

        switch (type) {
            case 'icon':
                return setElement(<Icon iconUpload={iconUpload}
                                        iconInputRef1={iconInputRef1}
                                        iconInputRef2={iconInputRef2}
                                        iconInputRef3={iconInputRef3}
                                        setIcon1={setIcon1}
                                        setIcon2={setIcon2}
                                        setIcon3={setIcon3}
                                        setIconError1={setErrorIcon1}
                                        setIconError2={setErrorIcon2}
                                        setIconError3={setErrorIcon3}
                                        iconImg1={icon1}
                                        iconImg2={icon2}
                                        iconImg3={icon3}
                                        error1={errorIcon1}
                                        error2={errorIcon2}
                                        error3={errorIcon3}
                                        reqData={reqData}/>)
            case 'title':
                return setElement(<Title register={register}
                                         reqData={reqData}/>)
            case 'description':
                return setElement(<Description register={register}
                                               reqData={reqData}
                                               setRawData={setRawData}
                                               setHtmlContents={setHtmlContents}
                                               editedRaw={editedRaw}
                                               descError={descError}/>)
        }
    }, [type, icon1, icon2, icon3, errorIcon1, errorIcon2, errorIcon3, descError, reqData]);

    return (
        <div className={'features-side'}>
            <form className={'features-form'} onSubmit={handleSubmit(Submit)}>
                <div className={'features-box-form'}>
                    <div className={'features-box-form__top'}>
                        <div>
                            <p>Image dimensions must be min 1920x850.</p>
                            <FileUploadInput
                                onChange={fileUpload}
                                text={'Upload Image'}
                                inputRef={fileInputRef}
                                required={!reqData}
                            />
                            <br/>
                            {image ? <img src={image} alt="img"/> : (reqData ? <img src={reqData.image} alt="img"/> : null)}
                            {error ? <Alert severity={'error'} style={{marginTop: 10}}>{error}</Alert> : null}
                        </div>
                        <div>
                            <h4>Main Title</h4>
                            <TextField
                                name="title-en"
                                id="standard-basic"
                                label="English"
                                variant="standard"
                                multiline
                                required={true}
                                defaultValue={reqData ? reqData.title.en : ''}
                                focused={!!reqData}
                                inputProps={{ maxLength: 60, }}
                                {...register('titleEn')}
                            />

                            <TextField
                                name="title-ru"
                                id="standard-basic"
                                label="Russian"
                                variant="standard"
                                multiline
                                required={true}
                                defaultValue={reqData ? reqData.title.ru : ''}
                                focused={!!reqData}
                                inputProps={{ maxLength: 60 }}
                                {...register('titleRu')}
                            />

                            <TextField
                                name="title-am"
                                id="standard-basic"
                                label="Armenian"
                                variant="standard"
                                multiline
                                required={true}
                                defaultValue={reqData ? reqData.title.hy : ''}
                                focused={!!reqData}
                                inputProps={{ maxLength: 60 }}
                                {...register('titleHy')}
                            />
                        </div>
                    </div>

                    <div className={'section-box'}>
                        <BasicFeaturesTabs setType={setType} type={type} reqData={reqData}/>
                        <div className={'section-area'}>
                            {element}
                        </div>
                    </div>
                </div>

                {
                    alert ?
                    <Alert severity={'success'}>Features is updated</Alert>
                    :
                    null
                }
                <div className={'features-form-btn'}>
                    <VilaButton text={`Save Features`} loadingText={'Saving Features...'} loading={loading}/>
                </div>
            </form>
            {
                reqData ? <FeaturesEditReview
                    reqData={reqData} htmlContents={htmlContents}
                    language={language} setLanguage={setLanguage}
                    image={image}
                /> : <LinearProgress/>
            }
        </div>
    );
}