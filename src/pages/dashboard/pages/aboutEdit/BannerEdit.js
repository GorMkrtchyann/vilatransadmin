import {Button, CircularProgress, LinearProgress} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BannersEdit} from "../../../../components/BannersEdit";

export const BannerEdit = () => {
    const [image, setImage] = useState(null)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/about/getBanner').then(r => {
                if (!r.data.error){
                    setImage(r.data.content[0])
                }
            }
        )
    }, [])

    const Submit = (imgData) => {
        return axios.put(process.env.REACT_APP_NODE_API + '/about/updateBanner',
            [imgData]
        ).then(res => {
                return res
            })
    };

    return (
        image ?
            <BannersEdit
                title={'About Us'}
                img={image}
                customSubmit={Submit}
            />

            :
            <LinearProgress/>
    );
};
