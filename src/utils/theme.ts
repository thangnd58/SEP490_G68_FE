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
            main: '#FFC68A' // warning color
        },
        success: {
            main: '#6EBF87' // success color
        },
        error: {
            main: '#FFCCCC' // error color
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
