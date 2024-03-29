import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {convertFromRaw, EditorState} from "draft-js";

export const StepsSelect = ({data, selectSteps, setSelectSteps, setEditorValues, setInputValues }) => {

    const handleChange = (SelectChangeEvent) => {
        const value = SelectChangeEvent.target.value
        setSelectSteps(value);
        setInputValues(data[value].title)
        setEditorValues({
            hy: EditorState.createWithContent(convertFromRaw({...data[value].description.hy, "entityMap": {}})),
            en: EditorState.createWithContent(convertFromRaw({...data[value].description.en, "entityMap": {}})),
            ru: EditorState.createWithContent(convertFromRaw({...data[value].description.ru, "entityMap": {}})),
        })
    };

    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">Steps</InputLabel>
            <Select
                required
                defaultValue={'title'}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectSteps}
                onChange={handleChange}
                label="Text"
            >
                <MenuItem value={'one'}>1</MenuItem>
                <MenuItem value={'two'}>2</MenuItem>
                <MenuItem value={'three'}>3</MenuItem>
                <MenuItem value={'for'}>4</MenuItem>
            </Select>
        </FormControl>
    );
}
