import { useMediaQuery, useTheme } from "@mui/material";

const useThemePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isIpad = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    return { isMobile,isIpad }
}

export default useThemePage;