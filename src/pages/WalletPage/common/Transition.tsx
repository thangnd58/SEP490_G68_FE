import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material"
import React, { useContext } from "react";

export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});