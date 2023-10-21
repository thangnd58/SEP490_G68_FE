import { Badge, IconButton, Tooltip } from '@mui/material';
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
    onClick?: () => void;
}

export default function MyIcon(props: MyIconProps) {
    return (
        <div>
            {props.hasTooltip ? (
                <Tooltip title={props.tooltipText} placement={props.position ? props.position : 'bottom'}>
                    <IconButton
                        onClick={props.onClick}
                    >
                        <Badge
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
                    onClick={props.onClick}
                    style={{ padding: '0px', margin: '0px' }}
                >
                    <Badge
                        color={"primary"}
                        badgeContent={props.badgeContent}
                        invisible={!props.hasBagde}
                    >
                        {props.icon}
                    </Badge>
                </IconButton>
            )}
        </div>
    )
}