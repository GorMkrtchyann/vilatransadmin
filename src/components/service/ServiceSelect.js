import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ServiceSelect({ SelectText, setSelectText }) {

    const handleChange = (SelectChangeEvent) => {
        setSelectText(SelectChangeEvent.target.value);
    };

    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">Menu</InputLabel>
            <Select
                defaultValue={'title'}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={SelectText}
                onChange={handleChange}
                label="Text"
            >
                <MenuItem value={'title'}>Title</MenuItem>
                <MenuItem value={'description'}>Description</MenuItem>
            </Select>
        </FormControl>
    );
}
