import { InputAdornment, MenuItem, TextField, Typography, styled } from "@mui/material";
import { useState } from "react";
import theme from "../../utils/theme";

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
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

interface ListItemProps {
    key: string;
    value: string
};

const MyCustomTextField: React.FC<CustomTextFieldProps> = ({ type, content, className, width, height, fontSize, fontWeight, borderRadius, icon, iconPosition, label, placeholder, multiline, listItems,
    onChange,
    disabled
}) => {
    const StyledTextField = CustomTextFieldStyle(width, borderRadius, height, fontSize, fontWeight, multiline);

    // const regexPattern = /^[0-9]{2}[A-Z]{2}[0-9]{2}[0-9]{5}$/;

    // // Tạo một tùy chọn dành riêng cho giá trị mặc định
    const defaultOption: ListItemProps = { key: "default", value: placeholder || "Vui lòng chọn" };

    // // Nếu không có danh sách, chỉ sử dụng tùy chọn mặc định
    const items = listItems ? [defaultOption, ...listItems] : [defaultOption];

    // // Initialize state với giá trị mặc định
    // const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultOption.value);

    // const handleMenuItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSelectedValue(event.target.value);
    // };

    return (
        <StyledTextField className="form">
            <TextField
                type={type}
                className={className}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                InputProps={{
                    startAdornment: iconPosition === 'start' ? <InputAdornment position="start">{icon}</InputAdornment> : null,
                    endAdornment: iconPosition === 'end' ? <InputAdornment position="end">{icon}</InputAdornment> : null,
                }}
                multiline={multiline}
                select={items.length > 1}
                // inputProps={
                //     {
                //         pattern: regexPattern.source,
                //     }
                // }
            >
                {items.map((item) => (
                    <MenuItem
                        key={item.key}
                        value={item.value}
                    >
                        <Typography
                            color={item.value === defaultOption.value ?
                                theme.palette.action.selected :
                                theme.palette.text.primary}
                        >
                            {item.value}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        </StyledTextField>
    );
};

export default MyCustomTextField;