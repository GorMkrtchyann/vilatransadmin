import {Alert, Button, LinearProgress, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {FileUploadInput} from "../../../../components/fileUploadInput";

export const BannerEdit = () => {
    const {handleSubmit, register, resetField} = useForm()
    const [image, setImage] = useState(null)
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

    const getImageSize = (srcImg) =>new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            resolve({
                width: this.width,
                height: this.height,
            })
        }
        img.src = srcImg
    })

    const ImageChange = async (file) => {
        if(!file[0].type.startsWith('image/')){
            setAlertErr('Image type must be jpg or png')
            inputRef.current.value = ''
            return
        }

        const renderImg = await imgRender(file[0])

        const sizes = await getImageSize(renderImg)

        if (sizes.width === 1920 && sizes.height === 1080){
            setImage(renderImg)
            setAlertErr(false)
        }else{
            setAlertErr('Image size must be 1920x1080 (width, height)')
            inputRef.current.value = ''
        }
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getBanner').then(r => {
                if (!r.data.error){
                    setImage(r.data.content[0])
                }
            }
        )
    }, [])

    const Submit = () => {
        setLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/contact/updateBanner', [
            image
        ]).then(r => {
                if (!r.data.error){
                    setImage(r.data.content[0])
                    setAlert(true)
                    setLoading(false)
                    inputRef.current.value = ''
                }
            }
        )
    }

    return(
        <div className={'bannerEdit'}>
            <h3>Edit Banner</h3>

            <form onSubmit={handleSubmit(Submit)}>
                <FileUploadInput ImageChange={ImageChange} inputRef={inputRef}/>

                {
                    loading ?
                        <LinearProgress/>
                        :
                        null
                }

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
                    <button className={'btn btn-primary fs-4 rounded-2'}>Save Image</button>
                </div>
            </form>

            <h4>Banner Preview / 1920x1080 (width, height)</h4>
            {
                image ?
                    <div className="bannerEdit__preview">
                        <img src={image} alt=""/>
                        <div className={'bannerEdit__preview__gradient'}/>
                        <div className="bannerEdit__preview__text">
                            <b>Contact Us</b>
                            <span>Vila Trans</span>
                        </div>
                    </div>
                    :
                    <LinearProgress/>
            }

        </div>
    )
}