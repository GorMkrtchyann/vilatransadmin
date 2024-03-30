import {Alert, Button, LinearProgress, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {FileUploadInput} from "./fileUploadInput";
import {VilaButton} from "./Button";

export const BannersEdit = ({title, img, customSubmit, newForm, haveButton = true}) => {
    const {handleSubmit} = useForm()
    const [image, setImage] = useState(img)
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
        img.onload = function() {
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

    const Submit = async () => {
        setLoading(true)
        const sending = await customSubmit(image)

        if (!sending.data.error){
            setAlert(true)
            setLoading(false)
            inputRef.current.value = ''
        }else{
            setAlertErr('Error from request')
        }
    }

    return(
        <div className={'bannerEdit'}>
            <h3>Edit Banner</h3>

            <div style={{display: "flex", gap: 30, marginBottom: 20}}>
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

                    {
                        haveButton ?
                            <div className={'officesInfo__form__btns'}>
                                <VilaButton text={'Save Image'} loading={loading} loadingText={'Saving Image...'}/>
                            </div>
                            :
                            null

                    }
                </form>
                {newForm}
            </div>

            <h4>Banner Preview / 1920x1080 (width, height)</h4>
            {
                image ?
                    <div className="bannerEdit__preview">
                        <img src={image} alt=""/>
                        <div className={'bannerEdit__preview__gradient'}/>
                        <div className="bannerEdit__preview__text">
                            <b>{title}</b>
                            <span>Vila Trans</span>
                        </div>
                    </div>
                    :
                    <LinearProgress/>
            }

        </div>
    )
}