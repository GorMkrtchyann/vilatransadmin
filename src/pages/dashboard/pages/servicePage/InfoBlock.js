import React, { useEffect, useState } from "react";
import {ServiceTextarea} from "../../../../components/service/ServiceTextarea";
import { ServiceInput } from "../../../../components/service/ServiceInput";
import { ServiceImg } from "../../../../components/service/ServiceImages";
import axios from "axios";
import {Alert, Button, CircularProgress, LinearProgress} from "@mui/material";
import { InfoPreview } from "../../../../components/service/InfoPreview";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import CustomizedSnackbars from "../../../../components/calcuator/alert";
import ServiceSelect from "../../../../components/service/ServiceSelect";
import {PreviewTopWithLanguages} from "../../../../components/PreviewTop";
import {VilaButton} from "../../../../components/Button";

export const InfoBlock = () => {
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState("en");
    const [selectText, setSelectText] = useState("title");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [editorValuesDis, setEditorValuesDis] = useState(null);
    const [editorValuesTitle, setEditorValuesTitle] = useState(null);

    const StatusAlert = (status, message) => {
        setOpen({
            openAlert: true,
            status: status,
            message: message,
        });
    }

    useEffect(() => {
        axios
            .get(process.env.REACT_APP_NODE_API + "/service/info")
            .then((res) => {
                setData(res.data)
                setEditorValuesDis({
                    hy: EditorState.createWithContent(convertFromRaw({...res.data.description.hy, "entityMap": {}})),
                    en: EditorState.createWithContent(convertFromRaw({...res.data.description.en, "entityMap": {}})),
                    ru: EditorState.createWithContent(convertFromRaw({...res.data.description.ru, "entityMap": {}}))
                })
                setEditorValuesTitle({
                    hy: EditorState.createWithContent(convertFromRaw({...res.data.title.hy, "entityMap": {}})),
                    en: EditorState.createWithContent(convertFromRaw({...res.data.title.en, "entityMap": {}})),
                    ru: EditorState.createWithContent(convertFromRaw({...res.data.title.ru, "entityMap": {}}))
                })
            })
            .catch((err) => {
                StatusAlert("error", "Error request")
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true);
        axios.patch(process.env.REACT_APP_NODE_API + `/service/info/${selectText}`,
            selectText === 'title' ? {
                en: convertToRaw(editorValuesTitle.en.getCurrentContent()),
                ru: convertToRaw(editorValuesTitle.ru.getCurrentContent()),
                hy: convertToRaw(editorValuesTitle.hy.getCurrentContent()),
            } : {
                en: convertToRaw(editorValuesDis.en.getCurrentContent()),
                ru: convertToRaw(editorValuesDis.ru.getCurrentContent()),
                hy: convertToRaw(editorValuesDis.hy.getCurrentContent()),
            }
        ).then((res) => {
                setLoading(false);
                StatusAlert("success", `Update successfully`,)
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
        data ?
            <div className="service">
                <div className="form-section">
                    <div className="service-file">
                        <ServiceImg
                            data={data}
                            setData={setData}
                        />
                    </div>
                    <form className="text-form" onSubmit={handleSubmit}>
                        <ServiceSelect selectText={selectText} setSelectText={setSelectText}/>
                        <div style={{width: '100%'}} className={'text-form__bottom'}>
                            {selectText === "title" ? (
                                <ServiceTextarea
                                    editorValues={editorValuesTitle}
                                    setLanguage={setLanguage}
                                    setEditorValues={setEditorValuesTitle}
                                    language={language}
                                />
                            ) : (
                                <ServiceTextarea
                                    editorValues={editorValuesDis}
                                    setLanguage={setLanguage}
                                    setEditorValues={setEditorValuesDis}
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
                </div>
                <div>
                    <PreviewTopWithLanguages setLanguage={setLanguage} language={language}/>
                    {data ? (
                        <InfoPreview
                            editorValuesDis={editorValuesDis}
                            editorValuesTitle={editorValuesTitle}
                            language={language}
                            data={data}
                        />
                    ) : (
                        <div className="center-loading">
                            <CircularProgress size={23}/>
                        </div>
                    )}
                </div>

            </div>
            :
            <LinearProgress/>
    );
};
