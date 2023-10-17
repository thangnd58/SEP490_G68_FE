import { Typography } from "@mui/material";
import { memo } from "react";
import theme from "../../utils/theme";

const ErrorMessage = memo(({ message }: { message: string }) => {
    return <Typography fontSize='13px' color={theme.palette.error.main}>
        {message}
    </Typography>
})

export default ErrorMessage