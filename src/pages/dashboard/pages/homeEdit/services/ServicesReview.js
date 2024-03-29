import React, {useState} from 'react';
import {Link} from "react-router-dom";
import BasicTabs from "../LangSelect";
import {PreviewTopWithLanguages} from "../../../../../components/PreviewTop";

export const ServicesReview = ({htmlContents, title, setLanguage, language}) => {

    return (
        <>
            <PreviewTopWithLanguages setLanguage={setLanguage} language={language}/>
            <div className={'services-side'}>
                <section className="section" style={{padding: '30px 0 0 0'}}>
                    <div className="container">
                        <div className="row bottom-70">
                            <div className="col-lg-4">
                                <div className="heading bottom-40"><span className="heading__pre-title">Services</span>
                                    <h3 className="heading__title">{title[`title-${language}`]}</h3><span
                                        className="heading__layout">Services</span>
                                </div>
                                <Link className="button button--green d-none d-lg-inline-block"
                                      to="#"><span>All services</span>
                                    <svg className="icon">
                                        <use xlinkHref="#arrow"/>
                                    </svg>
                                </Link>
                            </div>
                            <div className="col-lg-8">
                                <div dangerouslySetInnerHTML={{ __html: htmlContents[language + '1'] }}/>
                                <div dangerouslySetInnerHTML={{ __html: htmlContents[language + '2'] }} className="bottom-0"/>
                            </div>
                        </div>
                        <div className="row top-70 d-flex d-lg-none">
                            <div className="col-12 text-center"><Link className="button button--green" to="#"><span>All services</span>
                                <svg className="icon">
                                    <use xlinkHref="#arrow"/>
                                </svg>
                            </Link></div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}