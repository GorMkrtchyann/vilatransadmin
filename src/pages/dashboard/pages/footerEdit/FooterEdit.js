import {FileUploadInput} from "../../../../components/fileUploadInput";
import {Alert, Button, LinearProgress, TextField} from "@mui/material";
import {VilaButton} from "../../../../components/Button";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {Images} from "../../../../assets/images/Images";
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin, IconBrandYoutube, IconPhone, IconPlus, IconTrash,
} from "@tabler/icons-react";
import axios from "axios";

const mainColor = '#5D87FF'
const inputStyle = {display: "flex", alignItems: "center", gap: 5}

const FooterAddress = ({title, location, phone, email, hours}) => {

    return (
        <>
            <h6 className="page-footer__title title--white">{title}</h6>
            <div className="page-footer__details">
                <p><strong>Location:</strong> <span>{location}</span></p>
                <p><strong>Phone:</strong>
                    {
                        phone?.map((el, i) => (
                            <a href={"tel:" + el} key={el + i}>{el}</a>
                        ))
                    }
                </p>
                <p><strong>Email:</strong> <a href={"mailto:" + email}>{email}</a></p>
                <p><strong>Openning hours:</strong> <span>{hours}</span></p>
            </div>
        </>
    )
}

const SocialEdit = ({socials, id, setFooterData}) => {
    const {handleSubmit, register, unregister} = useForm()
    const [facebook, setFacebook] = useState(socials?.facebook ? socials.facebook : null)
    const [instagram, setInstagram] = useState(socials?.instagram ? socials.instagram : null)
    const [youtube, setYoutube] = useState(socials?.youtube ? socials.youtube : null)
    const [linkedin, setLinkedin] = useState(socials?.linkedin ? socials.linkedin : null)
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(false)

    const Submit = (data) => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/footer/updateSocialMedia', {
            id: id,
            obj: {
                social: data
            }
        }).then(r => {
                if (!r.data.error) {
                    setFooterData(r.data)
                    setAlert(true)
                    setLoading(false)
                }
            }
        )
    }

    return (
        <form onSubmit={handleSubmit(Submit)} className={'footerEdit__socialForm'}>
            <div>
                {
                    facebook ?
                        <div className={'footerEdit__socialForm__input'}>
                            <TextField
                                fullWidth
                                type={"url"}
                                id="standard-basic"
                                label={<div style={inputStyle}><IconBrandFacebook size={20}/> Facebook</div>}
                                variant="standard"
                                defaultValue={typeof facebook === 'string' ? facebook : null}
                                {...register('facebook')}
                                required
                            />
                            <IconTrash onClick={() => {
                                setFacebook(null)
                                unregister('facebook')
                            }}/>
                        </div>
                        :
                        <Button
                            type={'button'}
                            sx={{color: mainColor}}
                            variant="text"
                            onClick={() => setFacebook(true)}
                        ><IconPlus/> Add Facebook</Button>
                }
                {
                    instagram ?
                        <div className={'footerEdit__socialForm__input'}>
                            <TextField
                                fullWidth
                                type={"url"}
                                id="standard-basic"
                                label={<div style={inputStyle}><IconBrandInstagram size={20}/> Instagram</div>}
                                variant="standard"
                                defaultValue={typeof instagram === 'string' ? instagram : null}
                                {...register('instagram')}
                                required
                            />
                            <IconTrash onClick={() => {
                                setInstagram(null)
                                unregister('instagram')
                            }}/>
                        </div>
                        :
                        <Button
                            type={'button'}
                            sx={{color: mainColor}}
                            variant="text"
                            onClick={() => setInstagram(true)}
                        ><IconPlus/> Add Instagram</Button>
                }
                {
                    youtube ?
                        <div className={'footerEdit__socialForm__input'}>
                            <TextField
                                fullWidth
                                type={"url"}
                                id="standard-basic"
                                label={<div style={inputStyle}><IconBrandYoutube size={20}/> Youtube</div>}
                                variant="standard"
                                defaultValue={typeof youtube === 'string' ? youtube : null}
                                {...register('youtube')}
                                required
                            />
                            <IconTrash onClick={() => {
                                setYoutube(null)
                                unregister('youtube')
                            }}/>
                        </div>
                        :
                        <Button
                            type={'button'}
                            sx={{color: mainColor}}
                            variant="text"
                            onClick={() => setYoutube(true)}
                        ><IconPlus/> Add Youtube</Button>
                }
                {
                    linkedin ?
                        <div className={'footerEdit__socialForm__input'}>
                            <TextField
                                fullWidth
                                type={"url"}
                                id="standard-basic"
                                label={<div style={inputStyle}><IconBrandLinkedin size={20}/> Linkedin</div>}
                                variant="standard"
                                defaultValue={typeof linkedin === 'string' ? linkedin : null}
                                {...register('linkedin')}
                                required
                            />
                            <IconTrash onClick={() => {
                                setLinkedin(null)
                                unregister('linkedin')
                            }}/>
                        </div>
                        :
                        <Button
                            type={'button'}
                            sx={{color: mainColor}}
                            variant="text"
                            onClick={() => setLinkedin(true)}
                        ><IconPlus/> Add Linkedin</Button>
                }
            </div>
            {
                alert ?
                    <Alert severity="success">Social media is updated</Alert>
                    :
                    null
            }
            <div className={'officesInfo__form__btns'}>
                <VilaButton text={'Save Social Media'} loading={loading} loadingText={'Saving Social Media...'}/>
            </div>
        </form>
    )
}

export const FooterEdit = () => {
    const {handleSubmit} = useForm()
    const [image, setImage] = useState(Images.logo_white)
    const [footerData, setFooterData] = useState({})
    const [officeData, setOfficeData] = useState(null)
    const [alert, setAlert] = useState(false)
    const [alertErr, setAlertErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef()

    const imgRender = (file) => new Promise((resolve, reject) => {
        const render = new FileReader();
        render.onload = (event) => {
            resolve(event.target.result)
        };
        render.readAsDataURL(file)
    })

    const getImageSize = (srcImg) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve({
                width: this.width,
                height: this.height,
            })
        }
        img.src = srcImg
    })

    const ImageChange = async (file) => {
        if (!file[0].type.startsWith('image/')) {
            setAlertErr('Image type must be jpg or png')
            inputRef.current.value = ''
            return
        }

        const renderImg = await imgRender(file[0])

        const sizes = await getImageSize(renderImg)

        if (sizes.width > 250 && sizes.height > 150) {
            setImage(renderImg)
            setAlertErr(false)
        } else {
            setAlertErr('Image size must be width minimum 250, height minimum 150')
            inputRef.current.value = ''
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/footer/getFooter').then(
            r => {
                if (!r.data.error) {
                    setImage(r.data.logo)
                    setFooterData(r.data)
                }
            }
        )

        axios.get(process.env.REACT_APP_NODE_API + '/contact/getAllOfficeInfo'
        ).then(r => {
            if (!r.data.error) {
                setOfficeData(r.data)
            }
        })
    }, [])

    const Submit = () => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/footer/updateLogo', {
            id: footerData._id,
            obj: {
                logo: image
            }
        }).then(r => {
                if (!r.data.error) {
                    setImage(r.data.logo)
                    setFooterData(r.data)

                    setAlert(true)
                    setLoading(false)
                    inputRef.current.value = ''
                }
            }
        )
    }

    return (
        footerData._id && Array.isArray(officeData) ?
            <div style={{width: '100%'}} className={'footerEdit'}>
                <h3>Edit Logo And Social Medias</h3>
                <div className={'footerEdit__forms'}>
                    <form onSubmit={handleSubmit(Submit)}>
                        <FileUploadInput ImageChange={ImageChange} inputRef={inputRef}/>

                        {
                            alert ?
                                <Alert severity="success">Image is changed</Alert>
                                :
                                null
                        }
                        {
                            alertErr ?
                                <Alert severity="error">{alertErr}</Alert>
                                :
                                null
                        }

                        <div className={'officesInfo__form__btns'}>
                            <VilaButton text={'Save Image'} loading={loading} loadingText={'Saving Image...'}/>
                        </div>
                    </form>

                    <SocialEdit socials={footerData.social} id={footerData._id} setFooterData={setFooterData}/>
                </div>

                <div className="footerEdit__review">
                    <h3>Footer Preview</h3>
                    <footer className="page-footer footer">
                        <div className="container">
                            <div className={'footer__top'}>
                                <div className="col-lg-3">
                                    <h6 className="page-footer__title">Discover</h6>
                                    <ul className="page-footer__menu list--reset">
                                        <li><Link to={'#'}>Home</Link></li>
                                        <li><Link to={'#'}>About us</Link></li>
                                        <li><Link to={'#'}>Services</Link></li>
                                        <li><Link to={'#'}>Calculator</Link></li>
                                        <li><Link to={'#'}>Contact Us</Link></li>
                                    </ul>
                                </div>
                                <div className={'footer__top__scroll'}>
                                    {
                                        officeData?.map(el => (
                                            <div key={el}>
                                                <FooterAddress
                                                    title={el.name.en}
                                                    location={el.address.en}
                                                    phone={el.phones}
                                                    email={el.email}
                                                    hours={`${el.openClock} - ${el.closeClock}`}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="footer__middle">
                                <div>
                                    <img src={image} alt="logo"/>
                                </div>

                                <ul className="socials list--reset">
                                    <li className="socials__item"><a className="socials__link" href="#">
                                        <IconBrandFacebook/>
                                    </a></li>
                                    <li className="socials__item"><a className="socials__link" href="#">
                                        <IconBrandInstagram/>
                                    </a></li>
                                    <li className="socials__item"><a className="socials__link" href="#">
                                        <IconBrandYoutube/>
                                    </a></li>
                                    <li className="socials__item"><a className="socials__link" href="#">
                                        <IconBrandLinkedin/>
                                    </a></li>
                                </ul>
                            </div>

                            <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
                                <div style={{display: "flex"}}>
                                    <div className="page-footer__privacy"><Link to={'#'}>Terms and
                                        conditions</Link><Link
                                        to={'#'}>Privacy
                                        policy</Link><Link to={'#'}>Cookies</Link></div>
                                </div>
                                <div>
                                    <div className="page-footer__copyright">© {new Date().getFullYear()} Vila Trans.
                                        All rights
                                        reserved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            :
            <LinearProgress/>
    )
}