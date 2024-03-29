import React, {useEffect, useState} from "react";
import {ServiceTextarea} from "../../../../components/service/ServiceTextarea";
import {ServiceInput} from "../../../../components/service/ServiceInput";
import axios from "axios";
import {Alert, Button, CircularProgress, LinearProgress} from "@mui/material";
import {EditorState, convertFromRaw, convertToRaw} from "draft-js";
import ServiceSelect from "../../../../components/service/ServiceSelect";
import {StepsSelect} from "../../../../components/service/StepsSelect";
import {StepsPreview} from "../../../../components/service/StepsPreview";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";
import {VilaButton} from "../../../../components/Button";

export const WorksSteps = () => {
    const [inputValues, setInputValues] = useState(null);
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState("en");
    const [selectText, setSelectText] = useState("title");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [selectSteps, setSelectSteps] = useState("one");
    const [editorValues, setEditorValues] = useState(null);

    const StatusAlert = (status, message) => {
        setOpen({
            openAlert: true,
            status: status,
            message: message,
        });
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + "/service/steps").then((res) => {
            setInputValues(res.data.steps[selectSteps].title)
            setEditorValues({
                hy: EditorState.createWithContent(convertFromRaw({...res.data.steps[selectSteps].description.hy, "entityMap": {}})),
                en: EditorState.createWithContent(convertFromRaw({...res.data.steps[selectSteps].description.en, "entityMap": {}})),
                ru: EditorState.createWithContent(convertFromRaw({...res.data.steps[selectSteps].description.ru, "entityMap": {}})),
            })
            setData(res.data)
        })
    }, []);

    const Submit = (event) => {
        event.preventDefault();
        setLoading(true);

        const data = selectText === "title" ? {title: inputValues}
                : {
                    description: {
                        hy: convertToRaw(editorValues.hy.getCurrentContent()),
                        en: convertToRaw(editorValues.en.getCurrentContent()),
                        ru: convertToRaw(editorValues.ru.getCurrentContent()),
                    },
                };

        axios.patch(process.env.REACT_APP_NODE_API + `/service/steps/${selectText}`, {
                ...data,
                objName: selectSteps,
            })
            .then((res) => {
                setLoading(false);
                StatusAlert("success", `Update successfully `);
                setTimeout(() => setOpen(false), 5000)
                setData(res.data);
            })
    }

    return (
        data ?
            <div className="service">
                <form onSubmit={Submit} className="text-form" style={{marginBottom: 40}}>
                    <div className={'text-form__selects'} >
                        <ServiceSelect
                            selectText={selectText}
                            setSelectText={setSelectText}
                        />
                        <StepsSelect
                            selectSteps={selectSteps}
                            setSelectSteps={setSelectSteps}
                            setInputValues={setInputValues}
                            setEditorValues={setEditorValues}
                            data={data.steps}
                        />
                    </div>
                    <div className={'text-form__bottom'}>
                        {selectText === "title" ? (
                            <ServiceInput
                                inputValues={inputValues}
                                setInputValues={setInputValues}
                                setLanguage={setLanguage}
                                language={language}
                            />
                        ) : (
                            <ServiceTextarea
                                editorValues={editorValues}
                                setLanguage={setLanguage}
                                setEditorValues={setEditorValues}
                                language={language}
                            />
                        )}
                    </div>

                    {open ?
                        <Alert severity={open.status}>{open.message}</Alert>
                        :
                        null
                    }
                    <div className={'form_btns'}>
                        <VilaButton text={`Save ${selectText === "title" ? 'Title' : 'Description'}`}
                                    loading={loading}
                                    loadingText={`Saving ${selectText === "title" ? 'Title...' : 'Description...'}`}
                        />
                    </div>
                </form>

                <PreviewTopWithLanguages setLanguage={setLanguage} language={language}/>
                {data ? (
                    <StepsPreview
                        selectSteps={selectSteps}
                        editorValues={editorValues}
                        language={language}
                        inputValues={inputValues}
                        data={data}
                    />
                ) : (
                    <div className="center-loading">
                        <CircularProgress size={23}/>
                    </div>
                )}
            </div>
            :
            <LinearProgress/>
    );
};
