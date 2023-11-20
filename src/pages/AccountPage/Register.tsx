import React, { useContext, useEffect } from 'react'
import RegisterForm from './components/RegisterForm'
import { Box } from '@mui/material'
import { useAppSelector } from '../../hooks/useAction';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../contexts/ModalContext';
import MyDialog from '../../components/common/MyDialog';
import { ROUTES } from '../../utils/Constant';

function Register() {
  const { user } = useAppSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const { setContentModal, setShowModal, showModal } = useContext(ModalContext);

  const showModalIsLoggedin = () => {
    setContentModal(
      <MyDialog
        title="Thông báo"
        content="Bạn đã đăng nhập, mời bạn quay trở lại trang chủ"
        hasAgreeButton
        onClickAgree={() => {
          navigate(ROUTES.homepage)
        }}
      />
    )
    setShowModal(true)
  }
  useEffect(() => {
    if (user != null) {
      showModalIsLoggedin();
    }
  }, [user])
  return (
    <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <RegisterForm />
    </Box>
  )
}

export default Register