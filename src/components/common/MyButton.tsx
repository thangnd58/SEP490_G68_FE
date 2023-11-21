import { BorderColor, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Button, Typography, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({

}));

interface CustomButtonProps {
  onClick?: (e?: any) => void;
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

const MyCustomButton: React.FC<CustomButtonProps> = ({ onClick, content, className, width, height, fontSize, fontWeight, uppercase, borderRadius, icon, iconPosition, variant, type, disabled, isWrap, backgroundColor, noBorder, fontColor, borderColor, borderWeight, isChecked, justifyContent }) => {
  let borderWeightValue = borderWeight || 2;
  let backgroundColorCheckedValue = isChecked == true ? '#f5e9e1' : (isChecked == false ? '#fff' : (backgroundColor ? backgroundColor : (disabled ? '#777E90' : (variant === 'outlined' ? '#fff' : '#8B4513'))));
  return (
    <CustomButton
      disabled={disabled}
      className={className}
      onClick={onClick}
      type={type}
      sx={{
        justifyContent: justifyContent || 'center',
        width: width || 'auto',
        height: height || 'auto',
        textTransform: uppercase ? 'uppercase' : 'none',
        borderRadius: "8px",
        background: backgroundColorCheckedValue,
        border: noBorder ? 'none' : (borderColor ? `${borderWeightValue}px solid ${borderColor}` : (disabled ? `${borderWeightValue}px solid #777E90` : `${borderWeightValue}px solid #8B4513`)),
        padding: '8px 8px',
        "&:hover": {
          backgroundColor: backgroundColorCheckedValue,
          opacity: 1,
          boxShadow: "0 0 16px rgba(0, 0, 0, 0.25)", // Bóng xung quanh cả 4 phía
          transform: "scale(1.0005)", // Hiệu ứng scale (phóng to) khi hover
          transition: "transform 0.1s ease-in-out",          // Các hiệu ứng khác tùy theo yêu cầu
        },
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