import { BorderColor, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Button, Typography, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({

}));

interface CustomButtonProps {
  onClick?: () => void;
  content: string;
  className?: string;
  width?: string;
  height?: string;
  fontSize?: number;
  fontWeight?: number;
  uppercase?: boolean;
  borderRadius?: number;
  variant?: 'text' | 'outlined' | 'contained';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isWrap?: boolean;
  isChecked?: boolean;
  backgroundColor?: string;
  noBorder?: boolean;
  fontColor?: string;
  borderColor?: string;
  borderWeight?: number;
  justifyContent?: 'start' | 'center' | 'end';
}

const MyCustomButton: React.FC<CustomButtonProps> = ({ onClick, content, className, width, height, fontSize, fontWeight, uppercase, borderRadius, icon, iconPosition, variant, type, disabled, isWrap, backgroundColor, noBorder, fontColor, borderColor, borderWeight, isChecked,justifyContent }) => {
  let borderWeightValue = borderWeight || 2;
  let backgroundColorCheckedValue = isChecked == true ? '#f5e9e1' : (isChecked == false ? '#fff' : (backgroundColor ? backgroundColor : (disabled ? '#777E90' : (variant === 'outlined' ? '#fff' : '#8B4513'))));
  return (
    <CustomButton
      disabled={disabled}
      className={className}
      onClick={onClick}
      type={type}
      style={{
        justifyContent: justifyContent || 'center',
        width: width || 'auto',
        height: height || 'auto',
        textTransform: uppercase ? 'uppercase' : 'none',
        borderRadius: borderRadius || 8,
        background: backgroundColorCheckedValue,
        border: noBorder ? 'none' : (borderColor ? `${borderWeightValue}px solid ${borderColor}` : (disabled ? `${borderWeightValue}px solid #777E90` : `${borderWeightValue}px solid #8B4513`)),
        padding: '8px 8px',
      }}
      startIcon={iconPosition === 'left' ? icon : null}
      endIcon={iconPosition === 'right' ? icon : null}
    >
      <Typography
        fontWeight={fontWeight || '400'}
        fontSize={fontSize || 16}
        color={fontColor ? fontColor : (variant === 'outlined' ? '#8B4513' : '#fff')}
        style={{
          whiteSpace: isWrap ? 'normal' : 'nowrap',
        }}
      >
        {content}
      </Typography>
    </CustomButton>
  );
};

export default MyCustomButton;