import React, { useState, useEffect } from 'react';
import { Typography } from "@mui/material";
import theme from "../../utils/theme";

const ErrorMessage = ({ message }: { message: any }) => {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <Typography fontSize='13px' color="red">
      {message}
    </Typography>
  ) : null;
};

export default ErrorMessage;
