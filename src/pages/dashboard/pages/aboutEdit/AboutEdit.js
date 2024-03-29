import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import {BannerEdit} from "./BannerEdit";
import {InfoBlockOne} from "./InfoBlockOne";
import {InfoMap} from "./InfoMap";
import {InfoBlock} from "../servicePage/InfoBlock";
import {FeaturesEdit} from "../homeEdit/features/FeaturesEdit";

const ContactEditContent = ({type}) => {
    const [element, setElement] = useState(null)

    useEffect(() => {
        switch (type.toLowerCase()) {
            case 'banner':
                return setElement(<BannerEdit/>)
            case 'infoblockone':
                return setElement(<InfoBlockOne/>)
            case "infoblocktwo":
                return setElement(<InfoBlock/>);
            case "whychooseus":
                return setElement(<FeaturesEdit/>);
            case 'infomap':
                return setElement(<InfoMap/>)
        }
    }, [type])

    return (element)
}

export const AboutEdit = () => {
    const [type, setType] = useState('');

    return (
        <div>
            <FormControl fullWidth style={{marginBottom: 20}}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    onChange={(event) => setType(event.target.value)}
                >
                    <MenuItem value={'banner'}>Banner</MenuItem>
                    <MenuItem value={'infoBlockOne'}>Info Block 1</MenuItem>
                    <MenuItem value={'infoBlockTwo'}>Info Block 2</MenuItem>
                    <MenuItem value={'whyChooseUs'}>Why Choose Us</MenuItem>
                    <MenuItem value={'infoMap'}>Info Map</MenuItem>
                </Select>
            </FormControl>


            <ContactEditContent type={type}/>
        </div>
    )
}