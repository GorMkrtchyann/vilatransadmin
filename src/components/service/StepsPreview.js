import React from "react";
import StepsImg from "../../assets/images/services/steps.png";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
export const StepsPreview = ({
    data,
    inputValues,
    language,
    editorValues,
    selectSteps,
}) => {
    return (
        <div className={'transportPreview'}>
            <section className="bg--gray section-size" style={{background: '#31373f', padding: 30, position: 'relative'}}>
                <img className="section--bg t50 r0" src={StepsImg} alt="img" />
                <div className="container-steps">
                    <div className="row bottom-70">
                        <div className="col-12">
                            <div className="heading heading--white">
                                <span className="heading__pre-title mb-0" style={{color: '#fff'}}>
                                    {data.preTitle[language]}
                                </span>
                                <h3 className="heading__title heading--white" style={{color: '#fff'}}>
                                    {data.title[language]}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="row offset-50">
                        <div className="col-md-6 col-xl-3">
                            <div className="icon-item icon-item--white">
                                <div className="icon-item__count ">
                                    <span className="box-count--green">01</span>
                                </div>
                                <h6 className="icon-item__title" style={{color: '#fff'}}>
                                    {selectSteps === "one" && inputValues[language]
                                        ? inputValues[language]
                                        : data.steps.one.title[language]}
                                </h6>
                                <div
                                    className="icon-item__text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectSteps === "one" &&
                                            editorValues[language].getCurrentContent().hasText()
                                                ? draftToHtml(
                                                convertToRaw(
                                                    editorValues[language].getCurrentContent()
                                                )
                                                )
                                                : draftToHtml(data.steps.one.description[language]),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="icon-item icon-item--white">
                                <div className="icon-item__count">
                                    <span className="box-count--green">02</span>
                                </div>
                                <h6 className="icon-item__title" style={{color: '#fff'}}>
                                    {selectSteps === "two" && inputValues[language]
                                        ? inputValues[language]
                                        : data.steps.two.title[language]}
                                </h6>
                                <div
                                    className="icon-item__text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectSteps === "two" &&
                                            editorValues[language].getCurrentContent().hasText()
                                                ? draftToHtml(
                                                convertToRaw(
                                                    editorValues[language].getCurrentContent()
                                                )
                                                )
                                                : draftToHtml(data.steps.two.description[language]),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="icon-item icon-item--white">
                                <div className="icon-item__count">
                                    <span className="box-count--green">03</span>
                                </div>
                                <h6 className="icon-item__title" style={{color: '#fff'}}>
                                    {selectSteps === "three" && inputValues[language]
                                        ? inputValues[language]
                                        : data.steps.three.title[language]}
                                </h6>
                                <div
                                    className="icon-item__text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectSteps === "three" &&
                                            editorValues[language].getCurrentContent().hasText()
                                                ? draftToHtml(
                                                convertToRaw(
                                                    editorValues[language].getCurrentContent()
                                                )
                                                )
                                                : draftToHtml(data.steps.three.description[language]),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="icon-item icon-item--white">
                                <div className="icon-item__count">
                                    <span className="box-count--green">04</span>
                                </div>
                                <h6 className="icon-item__title" style={{color: '#fff'}}>
                                    {selectSteps === "for" && inputValues[language]
                                        ? inputValues[language]
                                        : data.steps.for.title[language]}
                                </h6>
                                <div
                                    className="icon-item__text"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            selectSteps === "for" &&
                                            editorValues[language].getCurrentContent().hasText()
                                                ? draftToHtml(
                                                convertToRaw(
                                                    editorValues[language].getCurrentContent()
                                                )
                                                )
                                                : draftToHtml(data.steps.for.description[language]),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
