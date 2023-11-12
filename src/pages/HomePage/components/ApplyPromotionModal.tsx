import React from 'react'
import MyDialog from '../../../components/common/MyDialog';

export default function ApplyPromotionModal() {
    return (
        <MyDialog
            style={{
                zIndex: 10001
            }}
            title="Thông báo"
            content="Bạn có muốn áp dụng mã giảm giá không?"
            hasAgreeButton
            hasCancelButton
            onClickAgree={() => { }}
        />
    )
}
