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
  const { user } = useAppSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const { openModal } = useContext(ModalContext);

  const showModalIsLoggedin = () => {
    openModal(
      <MyDialog
        title="Thông báo"
        content="Bạn đã đăng nhập, mời bạn quay trở lại trang chủ"
        hasAgreeButton
        onClickAgree={() => {
          navigate(ROUTES.homepage)
        }}
      />
    )
  }

  useEffect(() => {
    if (user != null) {
      showModalIsLoggedin();
    }
  }, [user])

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginForm />
      </Box>
    </>
  )
}

export default Login