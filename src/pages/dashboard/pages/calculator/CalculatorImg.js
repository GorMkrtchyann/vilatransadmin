import {Button, CircularProgress, LinearProgress} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BannersEdit} from "../../../../components/BannersEdit";

export const CalculatorImg = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/pages/calculator/images')
            .then(res => setData(res.data.data[0]))
            .catch(err => console.log(err))
    }, []);

    const handleSubmit = (imgData) => {
        return axios.patch(process.env.REACT_APP_NODE_API + '/pages/calculator/updateBanner', { images: imgData, id: data._id })
            .then(res => {
                setData(res.data.data)
                return res
            })
            .catch(res => {
                return res
            })
    };


    return (
        data ?
            <BannersEdit
                title={'Calculator'}
                img={data.images}
                customSubmit={handleSubmit}
            />

            :
            <LinearProgress/>
    );
};
