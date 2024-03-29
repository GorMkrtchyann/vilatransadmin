import React, {useEffect, useState} from 'react';
import {ServicesReview} from "./ServicesReview";
import {LinearProgress, TextField} from "@mui/material";
import {VilaButton} from "../../../../../components/Button";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import axios from "axios";
import {AccordionUsage} from "../EditorAccordions";
import ControlledOpenSelect from "./TextSection";
import OutlinedAlerts from "../ErrorAlert";

export const ServicesEdit = (props) => {
    const [loading, setLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [section, setSection] = useState('');
    const [error, setError] = useState('');
    const [title, setTitle] = useState({
        'title-en': '',
        'title-ru': '',
        'title-hy': ''
    });
    const [language, setLanguage] = useState('en')

    const [editorStates, setEditorStates] = useState({
        en1: EditorState.createEmpty(),
        ru1: EditorState.createEmpty(),
        hy1: EditorState.createEmpty(),
        en2: EditorState.createEmpty(),
        ru2: EditorState.createEmpty(),
        hy2: EditorState.createEmpty(),
    });

    const [rawData, setRawData] = useState({
        en1: {},
        ru1: {},
        hy1: {},
        en2: {},
        ru2: {},
        hy2: {},
    });

    const [htmlContents, setHtmlContents] = useState({
        en1: '',
        ru1: '',
        hy1: '',
        en2: '',
        ru2: '',
        hy2: '',
    });

    useEffect(() => {
        setSection('Text 1');

        axios.get(process.env.REACT_APP_NODE_API + '/home/get-services').then(res => {

            if (res.data) {
                const title = res.data.title;
                const text1 = res.data.text1;
                const text2 = res.data.text2;
                setEditorStates({
                    en1: EditorState.createWithContent(convertFromRaw({...text1.en, entityMap: {}})),
                    ru1: EditorState.createWithContent(convertFromRaw({...text1.ru, entityMap: {}})),
                    hy1: EditorState.createWithContent(convertFromRaw({...text1.hy, entityMap: {}})),
                    en2: EditorState.createWithContent(convertFromRaw({...text2.en, entityMap: {}})),
                    ru2: EditorState.createWithContent(convertFromRaw({...text2.ru, entityMap: {}})),
                    hy2: EditorState.createWithContent(convertFromRaw({...text2.hy, entityMap: {}})),
                });

                setTitle({
                    "title-en": title.en,
                    "title-ru": title.ru,
                    "title-hy": title.hy
                });

                setRawData({
                    en1: { ...text1.en, entityMap: {} },
                    ru1: { ...text1.ru, entityMap: {} },
                    hy1: { ...text1.hy, entityMap: {} },
                    en2: { ...text2.en, entityMap: {} },
                    ru2: { ...text2.ru, entityMap: {} },
                    hy2: { ...text2.hy, entityMap: {} }
                });

                setReviewLoading(true);
            }
        }).catch(error => console.error(error));
    }, []);

    useEffect(() => {
        setHtmlContents({
            en1: draftToHtml(rawData.en1),
            ru1: draftToHtml(rawData.ru1),
            hy1: draftToHtml(rawData.hy1),
            en2: draftToHtml(rawData.en2),
            ru2: draftToHtml(rawData.ru2),
            hy2: draftToHtml(rawData.hy2)
        })
    }, [rawData])

    const handleChange = (event) => {
        setTitle({
            ...title,
            [event.target.name]: event.target.value
        });
    };

    const onEditorStateChange = (newEditorState, key) => {
        setEditorStates(prevStates => ({
            ...prevStates,
            [key]: newEditorState,
        }));

        const rawContentState = convertToRaw(newEditorState.getCurrentContent());
        const html = draftToHtml(rawContentState);

        setRawData(prevContents => ({
            ...prevContents,
            [key]: rawContentState,
        }))

        setHtmlContents(prevContents => ({
            ...prevContents,
            [key]: html,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmptyField = (object) => {
            for(let key in object) {
                if (object[key].blocks[0].text.trim() === '') {
                    return true
                }
            }
            return false
        }

        const data = {
            title: {
                en: title["title-en"],
                ru: title["title-ru"],
                hy: title["title-hy"]
            },
            text1: {
                en: rawData.en1,
                ru: rawData.ru1,
                hy: rawData.hy1
            },
            text2: {
                en: rawData.en2,
                ru: rawData.ru2,
                hy: rawData.hy2
            }
        }

        // console.log(isEmptyField(data.text1))
        if (isEmptyField(data.text1) || isEmptyField(data.text2)) {
            return setError('Please fill in all fields.');
        } else {
            setError('');
        }

        if (!data.title.en || !data.title.ru || !data.title.hy) {
            return setError('Please fill in all fields.');
        } else {
            setError('');
        }

        setLoading(true);

        const updatedData = await axios.put(process.env.REACT_APP_NODE_API + '/home/update-services', data);

        if (updatedData) setLoading(false);
    }

    return (
        <>
            <form className={'services-form'} onSubmit={handleSubmit}>

                <div className={'blockForm__forms__inputsDiv'} id={'services-blockForm'}>
                    <div>
                        <h6>Title</h6>
                        <TextField
                            name="title-en"
                            id="standard-basic"
                            label="English"
                            variant="standard"
                            multiline
                            required={true}
                            onChange={handleChange}
                            value={title["title-en"]}
                            // defaultValue={editSlideObj ? editSlideObj.title.en : ""}
                            // focused={!!editSlideObj}
                            inputProps={{ maxLength: 60, }}
                        />

                        <TextField
                            name="title-ru"
                            id="standard-basic"
                            label="Russian"
                            variant="standard"
                            multiline
                            required={true}
                            onChange={handleChange}
                            value={title["title-ru"]}
                            // defaultValue={editSlideObj ? editSlideObj.title.ru : ""}
                            // focused={!!editSlideObj}
                            inputProps={{ maxLength: 60 }}
                        />

                        <TextField
                            name="title-hy"
                            id="standard-basic"
                            label="Armenian"
                            variant="standard"
                            multiline
                            required={true}
                            onChange={handleChange}
                            value={title["title-hy"]}
                            // defaultValue={editSlideObj ? editSlideObj.title.am : ""}
                            // focused={!!editSlideObj}
                            inputProps={{ maxLength: 60 }}
                        />
                    </div>
                    <div>
                        <ControlledOpenSelect section={section} setSection={setSection}/>
                        {section === 'Text 1' ?
                            <div className={'accordions'}>
                                {error ? <OutlinedAlerts message={error}/> : null}
                                <div>
                                    <AccordionUsage text={'English'}
                                                    editorState={editorStates.en1}
                                                    onEditorStateChange={onEditorStateChange}
                                                    setLanguage={setLanguage}
                                                    lang={'en1'}/>
                                </div>

                                <div>
                                    <AccordionUsage text={'Russian'}
                                                    editorState={editorStates.ru1}
                                                    onEditorStateChange={onEditorStateChange}
                                                    setLanguage={setLanguage}
                                                    lang={'ru1'}/>
                                </div>

                                <div>
                                    <AccordionUsage text={'Armenian'}
                                                    editorState={editorStates.hy1}
                                                    onEditorStateChange={onEditorStateChange}
                                                    setLanguage={setLanguage}
                                                    lang={'hy1'}/>
                                </div>
                            </div> :
                            <div className={'accordions'}>
                                {error ? <OutlinedAlerts message={error}/> : null}
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
                                                    setLanguage={setLanguage}
                                                    lang={'ru2'}/>
                                </div>

                                <div>
                                    <AccordionUsage text={'Armenian'}
                                                    editorState={editorStates.hy2}
                                                    onEditorStateChange={onEditorStateChange}
                                                    setLanguage={setLanguage}
                                                    lang={'hy2'}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className={'services-form-btn'}>
                    <VilaButton text={'Save Services'} loadingText={'Saving Services...'} loading={loading}/>
                </div>
            </form>
            {reviewLoading ?
                <ServicesReview language={language} setLanguage={setLanguage} htmlContents={htmlContents} title={title}/>
                :
                <LinearProgress/>
            }
        </>
    );
}