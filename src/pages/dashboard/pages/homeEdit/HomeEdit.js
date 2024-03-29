import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {useEffect, useState} from "react";
import {SlideEdit} from "./slider/SlideEdit";
import '../../../../assets/styles/home.scss'
import {ServicesEdit} from "./services/ServicesEdit";
import {FeaturesEdit} from "./features/FeaturesEdit";

const HomeEditContent = ({type}) => {
    const [element, setElement] = useState(null)

    useEffect(() => {
        switch (type.toLowerCase()) {
            case 'slider':
                return setElement(<SlideEdit/>)
            case 'services':
                return setElement(<ServicesEdit/>)
            case 'features':
                return setElement(<FeaturesEdit/>)
        }
    }, [type])

    return(element)
}

export const HomeEdit = () => {
    const [type, setType] = useState('');

    return(
        <div style={{width: '100%'}}>
            <FormControl fullWidth style={{marginBottom: 20}}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    onChange={(event) => setType(event.target.value)}
                >
                    <MenuItem value={'slider'}>Slider</MenuItem>
                    <MenuItem value={'services'}>Services</MenuItem>
                    <MenuItem value={'features'}>Features</MenuItem>
                </Select>
            </FormControl>

            <HomeEditContent type={type}/>
        </div>
    )
}