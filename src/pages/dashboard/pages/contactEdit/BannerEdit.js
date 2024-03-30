import {Alert, Button, LinearProgress, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {FileUploadInput} from "../../../../components/fileUploadInput";
import {BannersEdit} from "../../../../components/BannersEdit";

export const BannerEdit = () => {
    const [image, setImage] = useState(null)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getBanner').then(r => {
                if (!r.data.error){
                    setImage(r.data.content[0])
                }
            }
        )
    }, [])

    const Submit = (newImage) => {
        return axios.put(process.env.REACT_APP_NODE_API + '/contact/updateBanner', [newImage]).then(r => {
                if (!r.data.error){
                    setImage(r.data.content[0])
                    return r
                }
            }
        )
    }

    return(
        image ?
            <BannersEdit title={'Contact Us'} img={image} customSubmit={Submit}/>
            :
            <LinearProgress/>
    )
}