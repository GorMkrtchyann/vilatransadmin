import { convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"

export const TransportPreview = ({ data, language, inputValues, editorValues }) => {

    return (
        <div className="transportPreview">
            <div className="container">
                <div className="row  transport-title">
                    <div className="col-xl-4">
                        <div className="heading">
                            <span className="heading__pre-title">Services</span>
                            <h3 className="heading__title">{inputValues[language] || data.title[language]}</h3>
                        </div>
                    </div>
                    <div className="col-xl-8 top-20 top-xl-0 " dangerouslySetInnerHTML={{
                        __html: editorValues[language].getCurrentContent().hasText()
                            ? draftToHtml(
                                convertToRaw(editorValues[language].getCurrentContent())
                            )
                            : draftToHtml(data.description[language]),
                    }}>

                    </div>
                </div>
                <div className="row offset-50">
                    <div className="col-md-6 col-xl-3">
                        <div className="icon-item">
                            <div className="icon-item__img icon-item__img--small">
                                <img src={data.transport.car.images} alt="road freight" />
                            </div>
                            <h6 className="icon-item__title">{data.transport.car.title[language]}</h6>
                            <p className="icon-item__text">
                                {data.transport.car.title[language]}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="icon-item">
                            <div className="icon-item__img icon-item__img--small">
                                <img src={data.transport.shipping.images} alt="shipping" />
                            </div>
                            <h6 className="icon-item__title"> {data.transport.shipping.title[language]}</h6>
                            <p className="icon-item__text">
                                {data.transport.shipping.description[language]}

                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="icon-item">
                            <div className="icon-item__img icon-item__img--small">
                                <img src={data.transport.air.images} alt="plane" />
                            </div>
                            <h6 className="icon-item__title">{data.transport.air.title[language]}</h6>
                            <p className="icon-item__text">
                                {data.transport.air.description[language]}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="icon-item">
                            <div className="icon-item__img icon-item__img--small">
                                <img src={data.transport.train.images} alt="train" />
                            </div>
                            <h6 className="icon-item__title">{data.transport.train.title[language]}</h6>
                            <p className="icon-item__text">
                                {data.transport.train.description[language]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}