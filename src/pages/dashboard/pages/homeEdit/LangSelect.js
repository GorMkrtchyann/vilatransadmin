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

export default function BasicTabs(props) {
    const {setLang} = props;

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0:
                return setLang('en')
            case 1:
                return setLang('ru')
            case 2:
                return setLang('hy')
        }
    };

    return (
        <Box sx={{ width: '300px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="EN" {...a11yProps(0)} />
                    <Tab label="RU" {...a11yProps(1)} />
                    <Tab label="HY" {...a11yProps(2)} />
                </Tabs>
            </Box>
        </Box>
    );
}