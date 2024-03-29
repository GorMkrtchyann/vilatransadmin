import {Button, CircularProgress, LinearProgress} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomizedSnackbars from "../../../../components/calcuator/alert";
import {BannersEdit} from "../../../../components/BannersEdit";

export const ServiceBanner = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + "/service/images").then((res) => setData(res.data[0]))
    }, []);

    const Submit = async (image) => {
        return axios.patch(process.env.REACT_APP_NODE_API + "/service/images", {
                images: image,
            }).then((res) => {
                setData(res.data)
                return res
            });
    }


    return (
        data ?
            <BannersEdit title={'Service'} img={data.images} customSubmit={Submit}/>
            :
            <LinearProgress/>
    );
};
