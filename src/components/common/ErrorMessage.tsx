import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import theme from "../../utils/theme";

const ErrorMessage = ({ message }: { message: string }) => {
  const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setIsVisible(false);
//     }, 1000);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, []);

  return isVisible ? (
    <Typography fontSize='13px' color={theme.palette.error.main}>
      {message}
    </Typography>
  ) : null;
};

export default ErrorMessage;
