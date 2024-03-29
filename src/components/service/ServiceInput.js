import { TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { memo } from "react";
import {IconEye} from "@tabler/icons-react";

export const ServiceInput = ({ inputValues, setInputValues, setLanguage }) => {
    function handleChange(e) {
        const { name, value } = e.target;

        inputValues[name] = value
        setInputValues({...inputValues});
    }
    return (
        <>
            <div className="input-div">
                <TextField
                    required
                    className="input-title"
                    name="en"
                    value={inputValues.en || ""}
                    onChange={handleChange}
                    id="outlined-basic"
                    label="English Title"
                    variant="standard"
                    fullWidth
                />

                <IconEye
                    className="visibility-icon"
                    onClick={() => setLanguage("en")}
                />
            </div>
            <div className="input-div">
                <TextField
                    required
                    className="input-title"
                    name="ru"
                    value={inputValues.ru || ""}
                    onChange={handleChange}
                    id="outlined-basic"
                    label="Russian Title"
                    variant="standard"
                    fullWidth
                />

                <IconEye
                    className="visibility-icon"
                    onClick={() => setLanguage("ru")}
                />
            </div>
            <div className="input-div">
                <TextField
                    required
                    className="input-title"
                    name="hy"
                    value={inputValues.hy || ""}
                    onChange={handleChange}
                    id="outlined-basic"
                    label="Armenian Title"
                    variant="standard"
                    fullWidth
                />

                <IconEye
                    className="visibility-icon"
                    onClick={() => setLanguage("hy")}
                />
            </div>
        </>
    );
};
