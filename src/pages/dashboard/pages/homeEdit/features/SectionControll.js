import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicFeaturesTabs(props) {
    const {setType, reqData} = props;

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log(reqData)
        if(reqData) {
            setValue(newValue);
            switch (newValue) {
                case 0:
                    return setType('icon')
                case 1:
                    return setType('title')
                case 2:
                    return setType('description')
            }
        }
    };

    return (
        <Box sx={{ width: '300px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Icon" {...a11yProps(0)} />
                    <Tab label="Title" {...a11yProps(1)} />
                    <Tab label="Description" {...a11yProps(2)} />
                </Tabs>
            </Box>
        </Box>
    );
}