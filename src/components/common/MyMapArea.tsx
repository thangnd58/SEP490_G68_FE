import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import MyDialog from './MyDialog';
import { HelmetIcon } from '../../assets/icons';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyMapArea() {

  const clickAgree = () => {
    alert('agree');
  }

  return (
    <MyDialog icon={<HelmetIcon/>} title="Thông báo" content="Xin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủXin Mời bạn trở về trang chủ" hasAgreeButton hasCancelButton onClickAgree={clickAgree} />
  );
}