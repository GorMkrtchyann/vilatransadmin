import React, { useEffect, useState } from "react";
import {ServiceTextarea} from "../../../../components/service/ServiceTextarea";
import { ServiceInput } from "../../../../components/service/ServiceInput";
import axios from "axios";
import {Alert, Button, CircularProgress, LinearProgress} from "@mui/material";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import ServiceSelect from "../../../../components/service/ServiceSelect";
import { TransportPreview } from "../../../../components/service/TransportPreview";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";
import {VilaButton} from "../../../../components/Button";

export const TransportInfo = () => {
    const [inputValues, setInputValues] = useState({
        hy: "",
        en: "",
        ru: "",
    });
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState("en");
    const [selectText, setSelectText] = useState("title");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editorValues, setEditorValues] = useState(null);

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_NODE_API + "/service/transport")
            .then((res) => {
                setData(res.data)
                setInputValues(res.data.title)
                setEditorValues({
                    hy: EditorState.createWithContent(convertFromRaw({...res.data.description.hy, "entityMap": {}})),
                    en: EditorState.createWithContent(convertFromRaw({...res.data.description.en, "entityMap": {}})),
                    ru: EditorState.createWithContent(convertFromRaw({...res.data.description.ru, "entityMap": {}})),
                })
            })
            .catch((err) => {
                StatusAlert("error", "Error request")
                console.log(err)
            });
    }, []);

    const StatusAlert = (status, message) => {
        setOpen({
            openAlert: true,
            status: status,
            message: message,
        });
    }

    const Submit = (event) => {
        event.preventDefault();

        setLoading(true);
        axios
            .patch(process.env.REACT_APP_NODE_API + `/service/transport/${selectText}`,
                selectText === 'title' ? inputValues : {
                    en: convertToRaw(editorValues.en.getCurrentContent()),
                    ru: convertToRaw(editorValues.ru.getCurrentContent()),
                    hy: convertToRaw(editorValues.hy.getCurrentContent()),
                }
                )
            .then((res) => {
                setLoading(false);
                StatusAlert("success", `Update successfully `)
                setData(res.data);
                setTimeout(() => setOpen(false), 5000)
            })
            .catch((error) => {
                setLoading(false);
                StatusAlert("error", `Update error `)
                setTimeout(() => setOpen(false), 5000)
            });
    }

    return (
        <div className="service transportService">
            <form className="text-form" onSubmit={Submit}>
                <ServiceSelect selectText={selectText} setSelectText={setSelectText} />
                <div style={{width: '100%'}} className={'text-form__bottom'}>
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
            <div>
                <PreviewTopWithLanguages setLanguage={setLanguage} language={language}/>
                {data ? (
                    <TransportPreview
                        editorValues={editorValues}
                        language={language}
                        inputValues={inputValues}
                        data={data}
                    />
                ) : <LinearProgress/>}
            </div>
        </div>
    );
};