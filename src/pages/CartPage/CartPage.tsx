import useThemePage from '../../hooks/useThemePage'
import { Avatar, Typography, Button, Box } from '@mui/material';

function CartPage() {
    const { isMobile } = useThemePage();
    return (
        <Box display={'flex'} flexDirection={"column"} width={isMobile ?  "90%" : "80%"} margin={'auto'}>
            <Box width={'100%'}>
              <Typography variant="h5">Giỏ hàng</Typography>
            </Box>
            <Box display={'flex'} width={'100%'}>
                <Box width={'75%'} border={'1px black solid'}>
                    <Box>ABCD</Box>
                </Box>
                <Box width={'25%'} border={'1px black solid'}>
                    <Box>abc</Box>
                </Box>
            </Box>
        </Box>
    )
  }
  
  export default CartPage