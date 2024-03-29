import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { InfoBlock } from "./InfoBlock";
import { TransportInfo } from "./TransportInfo";
import { ServiceBanner } from "./ServiceBanner";
import { WorksSteps } from "./WorksSteps";

const ServiceEditContent = ({ type }) => {
    const [element, setElement] = useState(null);

    useEffect(() => {
        switch (type.toLowerCase()) {
            case "info":
                return setElement(<InfoBlock />);
            case "transport":
                return setElement(<TransportInfo />);
            case "banner":
                return setElement(<ServiceBanner />);
            case "works":
                setElement(<WorksSteps />)
        }
    }, [type]);

    return element;
};

export const ServicePage = () => {
    const [type, setType] = useState("");

    return (
        <>
            <div style={{ width: "100%" }} className="service">
                <FormControl fullWidth style={{ marginBottom: 20 }}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Type"
                        onChange={(event) => setType(event.target.value)}
                    >
                        <MenuItem value={"info"}>Info block</MenuItem>
                        <MenuItem value={"transport"}>Transport Info </MenuItem>
                        <MenuItem value={"banner"}>Banner </MenuItem>
                        <MenuItem value={"works"}>How we works </MenuItem>
                    </Select>
                </FormControl>

                <ServiceEditContent type={type} />
            </div>
        </>
    );
};
