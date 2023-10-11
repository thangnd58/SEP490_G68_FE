import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8B4513',
        },
        secondary: {
            main: '#777E90',
        },
        warning: {
            main: '#ff0000'
        }
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    shape: {
        borderRadius: 8
    },
});

export default theme;