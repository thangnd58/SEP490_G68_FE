import { Button, Typography, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  border: "2px solid #8B4513",
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
}

const MyCustomButton: React.FC<CustomButtonProps> = ({ onClick, content, className, width, height, fontSize, fontWeight, uppercase, borderRadius, icon, iconPosition,variant,type }) => {
  return (
    <CustomButton
      className={className}
      onClick={onClick}
      type={type}
      style={{
        height: height || '100%',
        textTransform: uppercase ? 'uppercase' : 'none',
        borderRadius: borderRadius || 8,
        background: variant === 'outlined' ? '#fff' : '#8B4513',
        // whiteSpace: 'nowrap',
        padding: '8px 16px',
      }}
      startIcon={iconPosition === 'left' ? icon : null}
      endIcon={iconPosition === 'right' ? icon : null}
    >
      <Typography
        width={"auto"}
        fontWeight= {fontWeight || '400'}
        fontSize= {fontSize || 16}
        color={variant === 'outlined' ? '#8B4513' : '#fff'}
      >
        {content}
      </Typography>
    </CustomButton>
  );
};

export default MyCustomButton;