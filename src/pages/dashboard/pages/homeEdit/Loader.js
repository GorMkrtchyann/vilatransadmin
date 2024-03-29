import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({size}) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress style={{color: 'white', width:size, height: size}}/>
        </Box>
    );
}