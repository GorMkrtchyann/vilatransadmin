import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ControlledOpenSelect({section, setSection}) {
    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
        setSection(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div className={'section-area'}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={section}
                    label="section"
                    onChange={handleChange}
                >
                    <MenuItem value={'Text 1'}>Text 1</MenuItem>
                    <MenuItem value={'Text 2'}>Text 2</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
