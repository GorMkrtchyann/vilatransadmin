import {CircularProgress} from "@mui/material";


export const VilaButton = ({text, onClick, color, type = 'submit', loading, loadingText = 'Loading...', variant}) => {
    const colorsArr = {
        green: 'vl-green',
        red: 'vl-red',
    }

    return(
        <button type={type} onClick={onClick} className={`vl-btn vl-text ${color ? colorsArr[color] : ''} ${loading ? 'loading' : ''}`} disabled={loading}>
            {
                loading ?
                    <>
                        <CircularProgress color="inherit" style={{width: 20, height: 20}}/>
                        {loadingText}
                    </>
                    :
                    text
            }
        </button>
    )
}