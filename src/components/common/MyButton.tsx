import { Button, Typography, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
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
}

const MyCustomButton: React.FC<CustomButtonProps> = ({ onClick, content, className, width, height, fontSize, fontWeight, uppercase, borderRadius, icon, iconPosition,variant,type,disabled,isWrap }) => {
  return (
    <CustomButton
      disabled={disabled}
      className={className}
      onClick={onClick}
      type={type}
      style={{
        width:width || 'auto',
        height: height || 'auto',
        textTransform: uppercase ? 'uppercase' : 'none',
        borderRadius: borderRadius || 8,
        background: disabled ? '#777E90' : (variant === 'outlined' ? '#fff' : '#8B4513'),
        border: disabled ? '2px solid #777E90' : '2px solid #8B4513',
        // whiteSpace: 'nowrap',
        padding: '8px 16px',
      }}
      startIcon={iconPosition === 'left' ? icon : null}
      endIcon={iconPosition === 'right' ? icon : null}
    >
      <Typography
        fontWeight= {fontWeight || '400'}
        fontSize= {fontSize || 16}
        color={variant === 'outlined' ? '#8B4513' : '#fff'}
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