import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import {OfficesInfo} from "./OfficesInfo";
import {SlideEdit} from "../homeEdit/slider/SlideEdit";
import {MapEdit} from "./MapEdit";
import {BannerEdit} from "./BannerEdit";

const ContactEditContent = ({type}) => {
    const [element, setElement] = useState(null)

    useEffect(() => {
        switch (type.toLowerCase()) {
            case 'officesinfo':
                return setElement(<OfficesInfo/>)
            case 'map':
                return setElement(<MapEdit/>)
            case 'banner':
                return setElement(<BannerEdit/>)
        }
    }, [type])

    return(element)
}

export const ContactEdit = () => {
    const [type, setType] = useState('');

    return(
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
                    <MenuItem value={'officesInfo'}>Offices Info</MenuItem>
                    <MenuItem value={'map'}>Map</MenuItem>
                    <MenuItem value={'banner'}>Banner</MenuItem>
                </Select>
            </FormControl>


            <ContactEditContent type={type}/>
        </div>
    )
}