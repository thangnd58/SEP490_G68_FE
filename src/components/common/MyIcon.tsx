import { Badge, Box, IconButton, Tooltip } from '@mui/material';
import React from 'react'

interface MyIconProps {
    icon: React.ReactNode;
    size?: number;
    hasTooltip?: boolean;
    tooltipText?: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start';
    hasBagde?: boolean;
    badgeContent?: string;
    badgeColor?: string;
    onClick?: (e: any) => void;
    noPadding?: boolean;
    noCursor?: boolean;
    disabled?: boolean;
    varient?: 'dot' | 'standard';
    backgroundColor?: string;
    color?: string;
    onHover?: () => void;
}

export default function MyIcon(props: MyIconProps) {
    return (
        <Box>
            {props.hasTooltip ? (
                <Tooltip title={props.tooltipText} placement={props.position ? props.position : 'bottom'}>
                    <IconButton
                        disabled={props.disabled ? props.disabled : false}
                        onClick={props.onClick}
                        onAbort={props.onHover}
                        sx={{
                            cursor: props.noCursor ? 'default' : 'pointer',
                            padding: props.noPadding ? '4px' : '8px',
                            margin: '0px',
                            backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
                            color: props.color ? props.color : 'inherit'
                        }}
                    >
                        <Badge
                            variant={props.varient ? props.varient : 'standard'}
                            color={"primary"}
                            badgeContent={props.badgeContent}
                            invisible={!props.hasBagde}
                        >
                            {props.icon}
                        </Badge>
                    </IconButton>
                </Tooltip>
            ) : (
                <IconButton
                    disabled={props.disabled ? props.disabled : false}
                    onClick={props.onClick}
                    style={{
                        cursor: props.noCursor ? 'default' : 'pointer',
                        padding: '0px', margin: '0px',
                        backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
                        color: props.color ? props.color : 'inherit'
                    }}
                >
                    <Badge
                        variant={props.varient ? props.varient : 'standard'}
                        color={"primary"}
                        badgeContent={props.badgeContent}
                        invisible={!props.hasBagde}
                    >
                        {props.icon}
                    </Badge>
                </IconButton>
            )}
        </Box>
    )
}
