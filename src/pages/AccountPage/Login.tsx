import React, { useContext, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import { Box } from '@mui/material'
import { useAppSelector } from '../../hooks/useAction';
import { ModalContext } from '../../contexts/ModalContext';
import MyDialog from '../../components/common/MyDialog';
import { HelmetIcon } from '../../assets/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';

function Login() {
  // const { user } = useAppSelector((state) => state.userInfo);
  // const navigate = useNavigate();

  // const { setContentModal, setShowModal } = useContext(ModalContext);

  // const showModalIsLogin = () => {
  //   setContentModal(
  //     <MyDialog
  //       icon={<HelmetIcon />}
  //       title="Thông báo"
  //       content="Bạn đã đăng nhập, mời bạn quay trở lại trang chủ"
  //       hasAgreeButton hasCancelButton
  //       onClickAgree={() => navigate(ROUTES.homepage)}
  //     />
  //   )
  //   setShowModal(true)
  // }

  // useEffect(() => {
  //   if (user?.role != null) {
  //     showModalIsLogin();
  //   }
  // }, [user])

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginForm />
      </Box>
    </>
  )
}

export default Login