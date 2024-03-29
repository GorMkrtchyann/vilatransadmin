import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ControlledOpenDescSelect({section, setSection}) {
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
        <div className={'desc-section-area'}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-controlled-open-select-label">Section</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={section}
                    label="description"
                    onChange={handleChange}
                >
                    <MenuItem value={'section 1'}>Section 1</MenuItem>
                    <MenuItem value={'section 2'}>Section 2</MenuItem>
                    <MenuItem value={'section 3'}>Section 3</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
