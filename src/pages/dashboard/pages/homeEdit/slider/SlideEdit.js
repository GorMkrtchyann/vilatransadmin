import {Alert, Button, LinearProgress, TextField} from "@mui/material";
import {SliderTable} from "./SliderTable";
import '../../../../../assets/styles/home.scss'
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {FileUploadInput} from "../../../../../components/fileUploadInput";
import {VilaButton} from "../../../../../components/Button";
import {useForm} from "react-hook-form";

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if(dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for(let i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}

const SlideEditForm = ({editSlide, setAllData, setEditSlide}) => {
    const {handleSubmit, register, reset} = useForm()
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState( null)
    const [video, setVideo] = useState( null)
    const [error, setError] = useState('');
    const [editSlideObj, setEditSlideObj] = useState(null);
    const [alert, setAlert] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editSlide) {
            reset()
            setEditSlideObj(editSlide)
            if (editSlide?.medias?.src.startsWith('data:video/')) {
                setImage(null)
                setVideo(editSlide?.medias)
            } else if (editSlide?.medias?.src.startsWith('data:image/')) {
                setVideo(null)
                setImage(editSlide?.medias)
            }
            return
        }

        setEditSlideObj(null)
    },[editSlide])

    const fileRender = (file) => new Promise((resolve, reject) => {
        const render = new FileReader();
        render.onload = (event) => {
            resolve(event.target.result);

        };
        render.onerror = (err) => reject(err);
        render.readAsDataURL(file);
    })

    const getVideoSize = (file) => new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const videoElement = document.createElement('video');
        videoElement.src = url

        videoElement.onloadedmetadata = () => {
            resolve({
                duration: videoElement.duration.toString(),
                width: videoElement.videoWidth,
                height: videoElement.videoHeight
            })
        };
    });

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

    const fileUpload = async (fileObj) => {
        const file = fileObj[0]

        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(null)
                setVideo(null)
                const renderImage = await fileRender(file)
                const getSizes = await getImageSize(renderImage)

                if (getSizes.width !== 1920 || getSizes.height !== 1080) {
                    setError('Image dimensions must be 1920x1080.');
                    fileInputRef.current.value = null;
                    setImage(null);
                    setVideo(null);
                    return
                } else {
                    setError('');
                }
                setVideo(null);
                setImage({
                    src: renderImage
                });
            }

            if (file.type.startsWith('video/')) {
                setImage(null)
                setVideo(null)
                const getSizeBool = await getVideoSize(file);
                const renderVideo = await fileRender(file);

                if (getSizeBool.width < 1200 || getSizeBool.width > 1920 || getSizeBool.height > 1080|| getSizeBool.height < 700) {
                    setError('Video dimensions must be minimum 1200x700 and maximum 1920x1080.');
                    setVideo(null);
                    setImage(null);
                    return
                } else {
                    setError('');
                }
                setImage(null)
                setVideo({
                    duration: getSizeBool.duration,
                    src: renderVideo
                })
            }
        } else {
            fileInputRef.current.value = null;
            setImage(null);
            setVideo(null);
        }
    }

    const Submit = async (data) => {
        setLoading(true)

        const sendingData = {
            medias: image ? image : video,
            title: {
                hy: data.titleAm ? data.titleAm : editSlideObj.title.hy,
                ru: data.titleRu ? data.titleRu : editSlideObj.title.ru,
                en: data.titleEn ? data.titleEn : editSlideObj.title.en
            },
            description: {
                hy: data.descriptionAm ? data.descriptionAm : editSlideObj.description.hy,
                ru: data.descriptionRu ? data.descriptionRu : editSlideObj.description.ru,
                en: data.descriptionEn ? data.descriptionEn : editSlideObj.description.en
            },
            link: data.btnLink ? data.btnLink : editSlideObj.link
        }

        if (editSlideObj){
            const res = await axios.put(process.env.REACT_APP_NODE_API + `/home/slide-edit`, {
                _id: editSlideObj._id,
                ...sendingData
            });
            if (res){
                reset();
                setVideo(null);
                setImage(null);
                setAllData(res.data);
                setLoading(false);
                setAlert('Slide is updated')
                setTimeout(() => setAlert(false), 5000)
            }
            return
        }

        const res = await axios.post(process.env.REACT_APP_NODE_API + '/home/slide', sendingData);
        if (res){
            reset();
            setVideo(null);
            setImage(null);
            setAllData(res.data);
            setLoading(false);
            setAlert('Slide is added')
            setTimeout(() => setAlert(false), 5000)
        }
    }

    const Resert = () => {
        setImage(null)
        setVideo(null)
        setEditSlide(null)
    }

    return(
        <form onSubmit={handleSubmit(Submit)}>

            <div className={'blockForm__forms__inputsDiv'}>
                <div>
                    <p>Image dimensions must be 1920x1080.</p>
                    <p>Video dimensions must be minimum 1200x700 and maximum 1920x1080.</p>
                    <FileUploadInput
                        onChange={fileUpload}
                        text={'Upload Image/Video'}
                        inputRef={fileInputRef}
                        required={!editSlideObj}
                    />

                    {
                        alert ?
                            <Alert severity={'success'}>{alert}</Alert>
                            :
                            null
                    }

                    {
                        error ?
                            <Alert severity="error">{error}</Alert>
                            :
                            null
                    }

                    {
                        image ?
                            <img className={'slide-img'} src={image?.src} alt="img"/>
                            :
                            null
                    }

                    {
                        video ?
                            <video className={'video-area'} src={video?.src} autoPlay={true} loop={true} muted={true}/>
                            :
                            null
                    }
                </div>
                <div>
                    <h6>Title</h6>
                    <TextField
                        name="title-en"
                        id="standard-basic"
                        label="English"
                        variant="standard"
                        multiline
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.title.en : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 60, }}
                        {...register('titleEn')}
                    />

                    <TextField
                        name="title-ru"
                        id="standard-basic"
                        label="Russian"
                        variant="standard"
                        multiline
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.title.ru : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 60 }}
                        {...register('titleRu')}
                    />

                    <TextField
                        name="title-am"
                        id="standard-basic"
                        label="Armenian"
                        variant="standard"
                        multiline
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.title.hy : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 60 }}
                        {...register('titleAm')}
                    />
                </div>
                <div>
                    <h6>Description</h6>
                    <TextField
                        name="description-en"
                        id="standard-basic"
                        multiline
                        rows={3}
                        label="English"
                        variant="standard"
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.description.en : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 150 }}
                        {...register('descriptionEn')}
                    />

                    <TextField
                        name="description-ru"
                        id="standard-basic"
                        multiline
                        rows={3}
                        label="Russian"
                        variant="standard"
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.description.ru : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 150 }}
                        {...register('descriptionRu')}
                    />

                    <TextField
                        name="description-am"
                        id="standard-basic"
                        multiline
                        rows={3}
                        label="Armenian"
                        variant="standard"
                        required={true}
                        defaultValue={editSlideObj ? editSlideObj.description.hy : ""}
                        focused={!!editSlideObj}
                        inputProps={{ maxLength: 150 }}
                        {...register('descriptionAm')}
                    />
                </div>
                <div>
                    <h6>Button</h6>
                    <TextField
                        type="url"
                        id="standard-basic"
                        label="Button Link"
                        variant="standard"
                        multiline
                        defaultValue={editSlideObj ? editSlideObj.link : ""}
                        focused={!!editSlideObj}
                        required={true}
                        {...register('btnLink')}
                    />
                </div>
            </div>

            <div className={'blockForm__forms__btns'}>
                {
                    editSlideObj ?
                        <Button variant={'text'} type={'reset'} color={'error'} onClick={Resert}>Cancel</Button>
                        :
                        null
                }
                <VilaButton text={`${editSlideObj ? 'Save' : 'Add'} Slider`} loadingText={`${editSlideObj ? 'Saving' : 'Adding'} Slider...`} loading={loading}/>
            </div>
        </form>
    )
}

export const SlideEdit = () => {
    const [allData, setAllData] = useState(null);
    const [editSlide, setEditSlide] = useState(null)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/home/slide-data').then(data => {
            setAllData(data.data);
        })
    }, [])

    return (
        <div className={'blockForm'}>
            <h3>{editSlide ? 'Edit' : "Add"} Slider</h3>
            <div className={'blockForm__forms'}>
                <SlideEditForm editSlide={editSlide} setAllData={setAllData} setEditSlide={setEditSlide}/>

                {
                    allData ?
                        <SliderTable allData={allData} setEditSlide={setEditSlide} setAllData={setAllData}/>
                        :
                        <LinearProgress/>
                }
            </div>

        </div>
    )
}