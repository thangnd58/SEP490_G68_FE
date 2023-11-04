import React from 'react'
import MyCustomButton from '../../components/common/MyButton'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';

export default function IntroductionMotorbike() {
    const navigate = useNavigate();
    return (
        <>
            <div>Bạn muốn trở thành chủ xe?</div>
            <MyCustomButton onClick={() => navigate(ROUTES.user.registermotorbike)} content={"Đăng ký ngay"} />
        </>
    )
}
