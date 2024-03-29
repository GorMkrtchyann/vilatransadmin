import React, {useRef, useState} from 'react';
import axios from 'axios';
import CustomizedSnackbars from '../calcuator/alert';
import {FileUploadInput} from "../fileUploadInput";
import {VilaButton} from "../Button";
import {Alert} from "@mui/material";

export const ServiceImg = ({ setData, data }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false)
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

    const handleFileChange = async (file) => {
        if (!file) {
            return
        }

        if (!file[0].type.startsWith('image/')) {
            inputRef.current.value = ''
            return StatusAlert("error", "File type not images")
        }

        const reader = await imgRender(file[0])
        const getSizes = await getImageSize(reader)


        if (getSizes.width >= 470 && getSizes.height >= 400) {
            setSelectedFile(reader)
            data.images = reader
            setData({...data})
        } else {
            inputRef.current.value = ''
            return StatusAlert("error", "Image size must be minimum 470x400")
        }
    };

    const StatusAlert = (status, message) => {
        setOpen({
            openAlert: true,
            status: status,
            message: message,
        });
    }

    const ImageSubmit = (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            axios.patch("http://localhost:8080/service/info/images", { images: selectedFile })
                .then(res => {
                    setLoading(false)
                    StatusAlert("success", "Successfully images update")
                    setData(res.data)
                    setTimeout(() => setOpen(false), 5000)
                })
                .catch(error => {
                    setLoading(false)
                    StatusAlert("error", "Error request")
                    setTimeout(() => setOpen(false), 5000)
                })

        } catch (error) {
            setLoading(false)
            StatusAlert("error", "Error")
            setTimeout(() => setOpen(false), 5000)
        }
    }

    return (
        <>
            <div>
                <p>Image minimum size 470x400</p>
                <form onSubmit={ImageSubmit} style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                    <FileUploadInput onChange={handleFileChange} inputRef={inputRef} required/>

                    {open ?
                        <Alert severity={open.status}>{open.message}</Alert>
                        :
                        null
                    }

                    <div style={{alignSelf: 'flex-end'}}>
                        <VilaButton text={'Save Image'} loading={loading} loadingText={'Saving Image...'}/>
                    </div>
                </form>
            </div>
        </>

    );
};
