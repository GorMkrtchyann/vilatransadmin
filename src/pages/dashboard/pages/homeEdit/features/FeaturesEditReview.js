import React, {useState} from 'react';
import {PreviewTopWithLanguages} from "../../../../../components/PreviewTop";

const FeaturesEditReview = ({reqData, htmlContents, setLanguage, language, image}) => {

    return (
        <>
            <PreviewTopWithLanguages setLanguage={setLanguage} language={language}/>
            <div className={'featuresPreview'}>
                <div className="features-section home-2" style={{overflow: 'hidden'}}>
                    <div className="container">
                        <div className="row feature-content">
                            <div className="col-xl-5 offset-xl-7 col-lg-6 offset-lg-6 pr-0">
                                <div className="features">
                                    <span className="title">Features</span>
                                    <h2 className="subtitle">{reqData ? reqData.title[language] : null}</h2>
                                    <div className="feature-lists">
                                        <div className="single-feature wow fadeInUp" data-wow-duration="1s">
                                            <div className="icon-wrapper"><img src={reqData ? reqData.section1.icon : null} alt="icon"/></div>
                                            <div className="feature-details">
                                                <h4>{reqData ? reqData.section1.title[language] : null}</h4>
                                                <div dangerouslySetInnerHTML={{ __html: htmlContents[`${language}1`] }}></div>
                                            </div>
                                        </div>
                                        <div className="single-feature wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                                            <div className="icon-wrapper"><img src={reqData ? reqData.section2.icon : null} alt="icon"/></div>
                                            <div className="feature-details">
                                                <h4>{reqData ? reqData.section2.title[language] : null}</h4>
                                                <div dangerouslySetInnerHTML={{ __html: htmlContents[`${language}2`] }}></div>
                                            </div>
                                        </div>
                                        <div className="single-feature wow fadeInUp" data-wow-duration="1s" data-wow-delay=".4s">
                                            <div className="icon-wrapper"><img src={reqData ? reqData.section3.icon : null} alt="icon"/></div>
                                            <div className="feature-details">
                                                <h4>{reqData ? reqData.section3.title[language] : null}</h4>
                                                <div dangerouslySetInnerHTML={{ __html: htmlContents[`${language}3`] }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <img className={'features-img'} src={image ? image : reqData ? reqData.image : ''} alt="img"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FeaturesEditReview;