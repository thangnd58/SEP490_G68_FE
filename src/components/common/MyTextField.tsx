import { InputAdornment, MenuItem, TextField, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";

const CustomTextFieldStyle = (
    width?: string,
    borderRadius?: number,
    height?: string,
    fontSize?: number,
    fontWeight?: number,
    multiline?: boolean
) => styled("form")(({ theme }) => ({
    '& .MuiTextField-root': {
        width: width ? width : '100%',
        // change color of icon of inputProps
        '& .MuiInputAdornment-root': {
            color: theme.palette.action.disabled,
        },
        '& .MuiInputBase-root': {
            alignItems: multiline ? 'flex-start' : 'center',
            minHeight: multiline ? '200px' : height ? height : 'auto',
            fontSize: fontSize ? fontSize : '16px',
            fontWeight: fontWeight ? fontWeight : '400',
        },
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.action.disabledBackground,
            borderRadius: borderRadius,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

interface CustomTextFieldProps {
    type?: string;
    content?: string;
    className?: string;
    width?: string;
    height?: string;
    fontSize?: number;
    fontWeight?: number;
    borderRadius?: number;
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
    label?: string;
    placeholder?: string;
    multiline?: boolean;
    listItems?: ListItemProps[];
    // selectedBrand?: number;
    // setSelectedBrand?: (value: React.SetStateAction<number>) => void;
    // disabled?: boolean;
};

interface ListItemProps {
    key: string;
    value: string
};

const MyCustomTextField: React.FC<CustomTextFieldProps> = ({ type, content, className, width, height, fontSize, fontWeight, borderRadius, icon, iconPosition, label, placeholder, multiline, listItems, 
    // setSelectedBrand, 
    // disabled,
    //  selectedBrand 
    }) => {
    const StyledTextField = CustomTextFieldStyle(width, borderRadius, height, fontSize, fontWeight, multiline);

    const [selectedValue, setSelectedValue] = useState("default");

    const handleSelectChange = (event: React.ChangeEvent<{ value: string }>) => {
        setSelectedValue(event.target.value);
        // setSelectedBrand(Number(event.target.value));
    };

    // useEffect(() => {
    //     if (selectedBrand === 0) {
    //         setSelectedValue("default");
    //     }
    // }, [selectedBrand]);

    return (
        listItems ?
            (
                <StyledTextField className="form">
                    <TextField
                        type={type}
                        className={className}
                        label={label}
                        placeholder={placeholder}
                        InputProps={{
                            startAdornment: iconPosition === 'start' ? <InputAdornment position="start">{icon}</InputAdornment> : null,
                            endAdornment: iconPosition === 'end' ? <InputAdornment position="end">{icon}</InputAdornment> : null,
                        }}
                        multiline={multiline}
                        select={listItems ? true : false}
                        SelectProps={{
                            native: true,
                        }}
                        value={selectedValue}
                        onChange={handleSelectChange}
                        // disabled={disabled}
                    >
                        <option key="default" value={0}>
                            {placeholder}
                        </option>
                        {listItems && listItems.map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.value}
                            </option>
                        ))}
                    </TextField>
                </StyledTextField>
            ) :
            (
                <StyledTextField className="form">
                    <TextField
                        type={type}
                        className={className}
                        label={label}
                        placeholder={placeholder}
                        InputProps={{
                            startAdornment: iconPosition === 'start' ? <InputAdornment position="start">{icon}</InputAdornment> : null,
                            endAdornment: iconPosition === 'end' ? <InputAdornment position="end">{icon}</InputAdornment> : null,
                        }}
                        multiline={multiline}
                    >
                    </TextField>
                </StyledTextField>
            )
    );
};

export default MyCustomTextField;