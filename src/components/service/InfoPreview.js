import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React from "react";

export const InfoPreview = ({ data, language, editorValuesTitle, editorValuesDis }) => {
    return (
        <div className="page-wrapper services main">
            <section className="section">
                <div className="container">
                    <div className="row flex-column-reverse flex-lg-row">
                        <div className="col-lg-6 top-50 top-lg-0">
                            <div className="heading bmb-9">
                                <h3 className="heading__title"
                                    dangerouslySetInnerHTML={{
                                        __html: editorValuesTitle[language].getCurrentContent().hasText()
                                            ? draftToHtml(
                                                convertToRaw(editorValuesTitle[language].getCurrentContent())
                                            )
                                            : null,
                                    }}
                                />
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: editorValuesDis[language].getCurrentContent().hasText()
                                        ? draftToHtml(
                                            convertToRaw(editorValuesDis[language].getCurrentContent())
                                        )
                                        : null,
                                }}
                                className="bottom-0 mt-3"
                            />
                        </div>
                        <div className="col-lg-6 col-xl-5 offset-xl-1">
                            <img className="w-100" src={data.images} alt="img" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
