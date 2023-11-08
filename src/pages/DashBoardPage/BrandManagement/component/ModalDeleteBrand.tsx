import { Box, Dialog, Typography } from "@mui/material";
import { ModalContext } from "../../../../contexts/ModalContext";
import { useContext } from "react";
import { Transition } from "../../../WalletPage/common/Transition";
import MyCustomButton from "../../../../components/common/MyButton";
import useThemePage from "../../../../hooks/useThemePage";

interface MyDialogProps {
    brandId: number;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalDeleteBrand = (props: MyDialogProps) => {
    const { closeModal } = useContext(ModalContext);
    const { isMobile } = useThemePage();

    return (
        <Dialog
            open={true}
            fullWidth
            onClose={closeModal}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    padding: '1rem',
                    alignItems: 'center',
                },
            }}
        >
            <Box minHeight={"100px"} textAlign={'center'}>
                <Typography>Bạn có muốn xóa thương hiệu</Typography>
            </Box>
            <MyCustomButton
                fontWeight={600}
                width="70%"
                fontSize={isMobile ? 12 : 16}
                // onClick={() => changeStatusTransfer()}
                content={"Xoa"}
            />
        </Dialog>
    )
}
export default ModalDeleteBrand;