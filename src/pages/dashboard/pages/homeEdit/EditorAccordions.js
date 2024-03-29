import * as React from 'react';
import {Editor} from "react-draft-wysiwyg";
import {useState} from "react";
import {IconChevronDown, IconEye, IconPalette, IconTextSize} from "@tabler/icons-react";
import {BlockPicker} from "react-color";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ColorPic = ({ expanded, onExpandEvent, onChange, currentState }) => {
    const [open, setOpen] = useState(false)
    const { color } = currentState;

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const onChanging = (color) => {
        onChange('color', color.hex);
    }

    return(
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
                        <BlockPicker color={color} onChangeComplete={onChanging} />
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

export const AccordionUsage = ({text, onEditorStateChange, editorState, lang, setLanguage}) => {
    const [open, setOpen] = useState(false)
    const languageObj = {
        English: 'en',
        Russian: 'ru',
        Armenian: 'hy',
    }

    const ToolbarObj = {
        options: ["inline",'fontSize', "list", "colorPicker"],
        inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
            bold: { className: "editorBtn" },
            italic: { className: "editorBtn" },
            underline: { className: "editorBtn" },
            strikethrough: { className: "editorBtn" },
        },
        fontSize: {
            component: FontSize,
            fontSize: 12,
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        },
        list: {
            options: ["ordered", "unordered"],
            ordered: { className: "editorBtn" },
            unordered: { className: "editorBtn" },
        },
        colorPicker: {
            component: ColorPic,
        },
    };
    return (
        <div className={'infoBlock__forms__accordion'}>
            <div className="infoBlock__forms__accordion__header">
                <h5>{text}</h5>

                <div>
                    <IconChevronDown onClick={() => setOpen(!open)}/>
                    <IconEye onClick={() => setLanguage(languageObj[text])}/>
                </div>
            </div>
            {
                open ?
                    <div className="infoBlock__forms__accordion__section">
                        <Editor
                            wrapperClassName="editor-wrapper"
                            editorClassName="editor-editor"
                            toolbarClassName="editor-toolbar"
                            editorState={editorState}
                            onEditorStateChange={(newEditorState) => onEditorStateChange(newEditorState, lang)}
                            toolbar={ToolbarObj}
                        />
                    </div>
                    :
                    null
            }
        </div>
    );
}