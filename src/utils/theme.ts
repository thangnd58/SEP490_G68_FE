import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8B4513',// primary color
        },
        secondary: {
            main: '#A26A42', // secondary color
        },
        text: {
            primary: '#000000', // primary text color
            secondary: '#73787E', // secondary text color
        },
        warning: {
            main: '#F29100' // warning color
        },
        success: {
            main: '#00BB5D' // success color
        },
        error: {
            main: '#F9503D' // error color
        },
        action: {
            hover: '#E0E0E0', // hover color
            selected: '#9A9EA5', // placeholder color
            disabled: '#777E90', // icon color
            disabledBackground: '#E0E0E0', // border color
        },
        common: {
            black: '#000000', // black color
            white: '#FFFFFF', // white color
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

export default theme;