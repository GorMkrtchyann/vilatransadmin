import {Tab, Tabs} from "@mui/material";


export const PreviewTopWithLanguages = ({language, setLanguage}) => {


    return(
        <div className={'preview_top'}>
            <h4>Preview</h4>

            <Tabs
                value={language}
                onChange={(e, newValue) => setLanguage(newValue)}
                aria-label="secondary tabs example"
                style={{marginBottom: 10}}
            >
                <Tab value="en" label="English" />
                <Tab value="ru" label="Russian" />
                <Tab value="hy" label="Armenian" />
            </Tabs>
        </div>
    )
}