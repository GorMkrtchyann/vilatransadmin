import {Link} from "react-router-dom";
import {IconCaretDownFilled, IconMail, IconPhone} from "@tabler/icons-react";
import {FileUploadInput} from "../../../../components/fileUploadInput";
import {Alert, TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {VilaButton} from "../../../../components/Button";

const inputStyle = {display: "flex", alignItems: "center", gap: 5}

const PhoneEdit = ({id, phone, setPhone}) => {
    const {handleSubmit, register} = useForm()
    const [alert, setAlert] = useState(false)
    const [alertErr, setAlertErr] = useState(false)
    const [loading, setLoading] = useState(false)

    const Submit = () => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/header/updatePhone', {
            id: id,
            obj: {
                phone: phone
            }
        }).then(r => {
                if (!r.data.error) {
                    setPhone(r.data.phone)

                    setAlert(true)
                    setLoading(false)
                }
            }
        )
    }

    return (
        <form onSubmit={handleSubmit(Submit)}>
            <TextField
                fullWidth
                type={'tel'}
                id="standard-basic"
                label={<div style={inputStyle}><IconPhone size={20}/> Phone</div>}
                variant="standard"
                value={phone}
                focused={!!phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />

            {
                alert ?
                    <Alert severity="success">Phone is saved</Alert>
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
                <VilaButton text={'Save Phone'} loading={loading} loadingText={'Saving Phone...'}/>
            </div>
        </form>

    )
}

const MailEdit = ({id, mail, setMail}) => {
    const {handleSubmit} = useForm()
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(false)

    const Submit = () => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/header/updateEmail', {
            id: id,
            obj: {
                email: mail
            }
        }).then(r => {
                if (!r.data.error) {
                    setMail(r.data.email)

                    setAlert(true)
                    setLoading(false)
                }
            }
        )
    }

    return (
        <form onSubmit={handleSubmit(Submit)}>
            <TextField
                fullWidth
                type={'email'}
                id="standard-basic"
                label={<div style={inputStyle}><IconMail size={20}/> Mail</div>}
                variant="standard"
                value={mail}
                focused={!!mail}
                onChange={(e) => setMail(e.target.value)}
                required
            />

            {
                alert ?
                    <Alert severity="success">Mail is saved</Alert>
                    :
                    null
            }

            <div className={'officesInfo__form__btns'}>
                <VilaButton text={'Save Mail'} loading={loading} loadingText={'Saving Mail...'}/>
            </div>
        </form>

    )
}

export const LogoEdit = () => {
    const {handleSubmit, register} = useForm()
    const [id, setId] = useState(null)
    const [image, setImage] = useState(null)
    const [phone, setPhone] = useState(null)
    const [mail, setMail] = useState(null)
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
        if (!file){
            return
        }

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
        axios.get(process.env.REACT_APP_NODE_API + '/header/getHeader').then(
            r => {
                if (!r.data.error) {
                    setId(r.data._id)
                    setImage(r.data.logo)
                    setPhone(r.data.phone)
                    setMail(r.data.email)
                }
            }
        )
    }, [])

    const Submit = () => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/header/updateLogo', {
            id: id,
            obj: {
                logo: image
            }
        }).then(r => {
                if (!r.data.error) {
                    setId(r.data._id)
                    setImage(r.data.logo)
                    setPhone(r.data.phone)
                    setMail(r.data.email)

                    setAlert(true)
                    setLoading(false)
                    inputRef.current.value = ''
                }
            }
        )
    }

    return (
        <div className={'logoEdit'}>
            <h3>Edit Logo And Contact Info</h3>

            <div style={{display: "flex", gap: 30, justifyContent: "space-between"}}>
                <form onSubmit={handleSubmit(Submit)}>
                    <FileUploadInput onChange={ImageChange} inputRef={inputRef}/>

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
                <PhoneEdit id={id} phone={phone} setPhone={setPhone}/>
                <MailEdit id={id} mail={mail} setMail={setMail}/>
            </div>

            <div className="logoEdit__preview">
                <h4>Header Preview</h4>
                <div className="header">
                    <div className={'sub-header'}>
                        <div className="container">
                            <div className="logo">
                                <img
                                    src={image}
                                    alt="logo"
                                />
                            </div>
                            <div className="header__right">
                                <div className="header__right__top">
                                    <div className="header__right__top--call">
                                        <IconPhone/>
                                        <div>
                                            <b>Free Call</b>
                                            <a href="">{phone}</a>
                                        </div>
                                    </div>
                                    <div className="header__right__top--mail">
                                        <IconMail/>
                                        <div>
                                            <b>Mail us</b>
                                            <a href="">{mail}</a>
                                        </div>
                                    </div>
                                    <Link to={'#'} className="header__right__top--btn">get a quote</Link>
                                </div>
                                <div className={'dec-line'}/>
                                <div className="header__right__bottom">
                                    <Link to={'#'}>Home</Link>
                                    <Link to={'#'}>About Us</Link>
                                    <Link to={'#'}>Services <IconCaretDownFilled/></Link>
                                    <Link to={'#'}>Calculator</Link>
                                    <Link to={'#'}>Contact us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}