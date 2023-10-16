import { Button, styled } from "@mui/material";

const CustomButton = styled(Button)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  }));
  
  interface CustomButtonProps {
    onClick: () => void;
    content: string;
    className?: string;
    width?: string;
    height?: string;
    fontSize?: number;
    fontWeight?: number;
    uppercase?: boolean;
    borderRadius?: number;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
  }
  
  const MyCustomButton: React.FC<CustomButtonProps> = ({ onClick, content,className, width, height, fontSize, fontWeight, uppercase, borderRadius, icon, iconPosition }) => { 
    return (
      <CustomButton
        className={className}
        onClick={onClick}
        style={{
          width: width || '100%',
          height: height || '100%',
          fontSize: fontSize || 16,
          fontWeight: fontWeight || 'bold',
          textTransform: uppercase ? 'uppercase' : 'none',
          borderRadius: borderRadius || 8,
        }}
        startIcon={iconPosition === 'left' ? icon : null}
        endIcon={iconPosition === 'right' ? icon : null}
      >
        {content}
      </CustomButton>
    );
  };
  
  export default MyCustomButton;