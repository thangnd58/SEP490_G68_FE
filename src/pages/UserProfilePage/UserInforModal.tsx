import React, { useContext, useEffect, useState } from 'react'
import { Feedback, FeedbackRequest, Motorbike, ReportCategory, ReportRequest, User } from '../../utils/type';
import usei18next from '../../hooks/usei18next';
import { ModalContext } from '../../contexts/ModalContext';
import { ReportService } from '../../services/ReportService';
import { useFormik } from 'formik';
import * as Yup from "yup";
import ToastComponent from '../../components/toast/ToastComponent';
import { Box, Dialog, DialogContent, IconButton, Rating, TextField, Typography } from '@mui/material';
import { Transition } from '../WalletPage/common/Transition';
import MyIcon from '../../components/common/MyIcon';
import { CloseOutlined, Grade, Luggage, ReadMore, SendRounded } from '@mui/icons-material';
import { LogoHeader } from '../../assets/images';
import { HomePageService } from '../../services/HomePageService';
import MotorbikeInforCard from '../HomePage/components/MotorbikeInforCard';
import { Avatar, Divider } from 'antd';
import theme from '../../utils/theme';
import useThemePage from '../../hooks/useThemePage';
import UserService from '../../services/UserService';
import dayjs from 'dayjs';
import { getPreviousTimeRelative } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/Constant';
import MyCustomButton from '../../components/common/MyButton';
import { FeedbackService } from '../../services/FeedbackService';

export default function UserInforModal(props: { userId: number, isOpened?: boolean, closeModal?: () => void }) {
    const { userId } = props;
    const { t } = usei18next();
    const { closeModal } = useContext(ModalContext);
    const { isMobile } = useThemePage();
    const [userInformation, setUserInformation] = useState<User>();
    const [feedback, setFeedback] = useState<Feedback[]>();
    const navigate = useNavigate();
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const dataUser = await UserService.getUserDetailInformation(userId.toString());
            if (dataUser) {
                setUserInformation(dataUser);
                // get all feedback of user
                setFeedback(dataUser.motorbikes.map((item: Motorbike) => item.feedbacks).flat());
            }
        } catch (error) {
            console.log(error);
        }
    }

    // auto close modal if user click back button on webrowser
    useEffect(() => {
        window.onpopstate = () => {
            closeModal();
        };
    }, []);

    return (
        <>
            <Dialog
                open={props.isOpened ? props.isOpened : true}
                onClose={props.closeModal ? props.closeModal : closeModal}
                TransitionComponent={Transition}
                fullWidth
                PaperProps={{
                    className: "hiddenSroll",
                    sx: {
                        borderRadius: "16px",
                        padding: '16px',
                        margin: isMobile ? '0px' : '32px',
                        maxWidth: isMobile ? '95%' : '75%',
                    }
                }}
                sx={{
                    zIndex: 9998
                }}
            >
                <Box height={"10%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <img style={{ cursor: 'pointer', }} alt="logo" src={LogoHeader} width={"150px"} />
                    <MyIcon icon={<CloseOutlined />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-close")} onClick={props.closeModal ? props.closeModal : closeModal} position='bottom' />
                </Box>
                <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"center"} alignItems={"start"} sx={{ padding: isMobile ? "16px 0px" : '32px 16px' }} gap={'32px'}>
                    {/* Thông tin người dùng */}
                    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} sx={{
                        gap: '4px',
                        position: isMobile ? 'none' : 'sticky',
                        top: isMobile ? 'none' : '16px',
                        width: isMobile ? '100%' : 'auto',
                    }}>
                        <Box width={isMobile ? '100%' : 'auto'} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                            sx={{
                                gap: '1rem',
                                width: isMobile ? '100%' : '40vh',
                                height: isMobile ? 'auto' : '40vh',
                                borderRadius: '8px',
                                backgroundColor: 'rgb(139, 69, 19, 0.1)',
                                padding: '1rem 0px',
                            }}
                        >
                            <Typography fontWeight={'600'} fontSize={'20px'}>{t("userProfile.Title")}</Typography>
                            <Avatar size={100} src={userInformation?.avatarUrl} />
                            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} width={"100%"} gap={'4px'}>
                                <Typography fontWeight={'600'} fontSize={'20px'}>{userInformation?.name}</Typography>
                                <Typography fontWeight={'400'} fontSize={'14px'} color={theme.palette.text.secondary}> {t("userProfile.createAt") + " " + dayjs(userInformation?.createDatetime).format('DD/MM/YYYY')}
                                </Typography>
                            </Box>
                            {/* Lượt đặt và lượt đánh giá */}
                            <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} width={"100%"} gap={'32px'}>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                                    <Typography fontWeight={'500'} fontSize={'16px'}>{t("editional.booking")} </Typography>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                                        <Luggage sx={{ color: theme.palette.text.secondary }} />
                                        <Typography fontWeight={'400'} fontSize={'14px'} color={theme.palette.text.secondary}>{userInformation?.totalBooking}</Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                                    <Typography fontWeight={'500'} fontSize={'16px'}>{t("dashBoardManager.feedback.rating")}</Typography>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                                        <Grade sx={{ color: theme.palette.text.secondary }} />
                                        <Typography fontWeight={'400'} fontSize={'14px'} color={theme.palette.text.secondary}>{userInformation?.averageRating.toFixed(1)}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                    <DialogContent sx={{
                        margin: '0px 0px',
                        padding: '0px 0px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        width: isMobile ? '100%' : 'auto',
                    }}
                    >
                        {isMobile ? (
                            <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                                    sx={{
                                        gap: '8px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(5, 69, 19, 0.1)',
                                        width: '90%',
                                        padding: '8px 1rem ',
                                    }}
                                >
                                    <Typography width={"100%"} textAlign={'start'} fontWeight={'600'} fontSize={'20px'}>{t("userProfile.ListMotorbike")}</Typography>
                                </Box>
                                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-evenly"} flexWrap={'wrap'} alignItems={"center"}
                                    sx={{
                                        marginTop: '8px',
                                        gap: '1rem',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {
                                        userInformation?.motorbikes.map((item: Motorbike, index: number) => (
                                            <MotorbikeInforCard isInModal motorbike={item} isFavoritePage={false} isIntroduced={true} />
                                        ))
                                    }
                                </Box>
                            </Box>
                        ) : (
                            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                                sx={{
                                    gap: '8px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgb(5, 69, 19, 0.1)',
                                    padding: '1rem',
                                }}
                            >
                                <Typography width={"100%"} textAlign={'start'} fontWeight={'600'} fontSize={'20px'}>{t("userProfile.ListMotorbike")}</Typography>
                                <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-evenly"} flexWrap={'wrap'} alignItems={"start"}
                                    sx={{
                                        gap: '1rem',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {
                                        userInformation?.motorbikes.map((item: Motorbike, index: number) => (
                                            <MotorbikeInforCard key={`${item.id}_${index}`} motorbike={item} isFavoritePage={false} isIntroduced={true} />
                                        ))
                                    }
                                </Box>
                            </Box>
                        )}
                        {isMobile ? (<Divider style={{ margin: "8px 0px" }} />) : (<Divider />)}

                        {feedback && feedback?.length > 0 ? (
                            <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                                sx={{
                                    width: isMobile ? '90%' : 'auto',
                                    gap: '16px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgb(5, 69, 19, 0.1)',
                                    padding: '1rem',
                                }}
                            >
                                <Box display={"flex"} flexDirection={isMobile ? 'column' : "row"} justifyContent={"space-between"} alignItems={isMobile ? 'start' : "center"} width={"100%"}>
                                    <Typography textAlign={'start'} fontWeight={'600'} fontSize={'20px'}>{t("dashBoardManager.feedback.rating")}</Typography>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={'4px'}>
                                        <Grade sx={{ color: '#FFD700' }} />
                                        <Typography textAlign={'start'} fontWeight={'500'} fontSize={'16px'}>{userInformation?.averageRating.toFixed(1)}</Typography>
                                        <Divider type="vertical" />
                                        <Typography textAlign={'start'} fontWeight={'500'} fontSize={'16px'}>{feedback.length} {t("dashBoardManager.feedback.rating")}</Typography>
                                    </Box>
                                </Box>
                                <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"}
                                    sx={{
                                        gap: '1rem',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {
                                        feedback.map((item: Feedback) => (
                                            <CommentItem replyComment='' isMobile={isMobile} rating={item.rating} avatar={item.user.avatarUrl} name={item.user.name} comment={item.comment} dateComment={item.createDatetime} />
                                        ))
                                    }
                                </Box>
                            </Box>) :
                            (
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}
                                    sx={{
                                        width: isMobile ? '90%' : 'auto',
                                        gap: '16px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgb(5, 69, 19, 0.1)',
                                        padding: '1rem',
                                    }}
                                >
                                    <Box display={"flex"} flexDirection={isMobile ? 'column' : "row"} justifyContent={"space-between"} alignItems={isMobile ? 'start' : "center"} width={"100%"}>
                                        <Typography textAlign={'start'} fontWeight={'600'} fontSize={'20px'}>Đánh giá</Typography>
                                        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={'4px'}>
                                            <Typography textAlign={'start'} fontWeight={'500'} fontSize={'16px'}>
                                                Chưa có đánh giá
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>)
                        }
                    </DialogContent>
                </Box >
            </Dialog >
        </>
    )

}
interface CommentItemProps {
    avatar?: string;
    dateComment?: string;
    name?: string;
    rating?: number;
    comment?: string;
    replyComment: string;
    isMobile?: boolean;
    isDetail?: boolean;
    isOwner?: boolean;
    bookingId?: number;
    motorbikeId?: number;
    feedbackId?: number;
    dateReplyComment?: string;
    reload?: () => void;
}


export function CommentItem(props: CommentItemProps) {
    const { avatar, dateComment, name, rating, comment, replyComment, isMobile } = props;
    const { t } = usei18next();
    const navigate = useNavigate();

    const [isReply, setIsReply] = useState(replyComment ? true : false);
    const [isEdit, setIsEdit] = useState(replyComment ? false : true);


    const [replyCommentTextField, setReplyCommentTextField] = useState(replyComment || "");

    const handleReplyCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplyCommentTextField(event.target.value);
    };

    const handleReplyCommentSubmit = async () => {
        try {
            if (!replyCommentTextField) {
                return;
            }
            const data: FeedbackRequest = {
                bookingId: props.bookingId,
                motorbikeId: props.motorbikeId,
                rating: 0,
                comment: replyCommentTextField,
            }
            if (replyComment) {
                const response = await FeedbackService.putFeedback(props.feedbackId?.toString()!, data);
                if (response) {
                    setIsEdit(false);
                    // props.reload && props.reload();
                }
            }
            else {
                const response = await FeedbackService.postFeedback(data);
                if (response) {
                    setIsEdit(false);
                    // props.reload && props.reload();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (<Box width={isMobile ? '90%' : "95%"} display={"flex"} flexDirection={"column"} justifyContent={"start"} alignItems={"start"} sx={{
        backgroundColor: "#fff",
        borderRadius: '8px',
        padding: '16px'
    }}>
        <Box width={"100%"} display={"flex"} flexDirection={isMobile ? 'column' : "row"} justifyContent={"flex-start"} alignItems={"start"} gap={'8px'}>
            {
                isMobile ?
                    <>
                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"start"} gap={'4px'}>
                            <Avatar size={60} src={avatar} />
                            <Box width={"90%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"start"} gap={'4px'}>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'4px'}>
                                    <Typography textAlign={'start'} fontWeight={'500'} fontSize={'16px'}>{name}</Typography>
                                    {
                                        /* Rating */
                                    }
                                    <Rating name="read-only" value={rating} readOnly />
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"end"} gap={'4px'}>
                                    {
                                        /* Thời gian đăng */
                                    }
                                    <Typography textAlign={'start'} fontWeight={'400'} fontSize={'12px'}>{getPreviousTimeRelative(dateComment || "", t)}</Typography>                        {
                                        /* Read more */
                                    }
                                    {props.isDetail &&
                                        <MyIcon
                                            icon={
                                                <ReadMore />
                                            }
                                            position='bottom'
                                            hasTooltip
                                            tooltipText={t("favourite.item.view")}
                                            onClick={() => {

                                                props.isOwner ?
                                                    navigate(`/${ROUTES.booking.detail_owner}/${props.bookingId}`) :
                                                    navigate(`/${ROUTES.booking.detail}/${props.bookingId}`)

                                            }}
                                        />}

                                </Box>
                            </Box>
                        </Box>
                        <Box width={isMobile ? "100%" : "90%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'8px'}>

                            {
                                /* Comment */
                            }
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'4px'} sx={{
                                    borderRadius: '8px',
                                    border: '1px solid #E0E0E0',
                                    padding: '6px' // Adjust padding as needed
                                }}>
                                    <Typography textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{comment}</Typography>
                                </Box>
                            </Box>
                            {
                                /* Reply Comment */
                            }
                            {/* {replyComment && */}
                            {
                                props.isOwner ? (
                                    isReply ? (
                                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>

                                            <Typography whiteSpace={'nowrap'} textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{t("editional.owner")}</Typography>
                                            <TextField
                                                fullWidth
                                                value={replyCommentTextField}
                                                onChange={handleReplyCommentChange}
                                                size='medium'
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: "8px",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                        '&:hover fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        color: 'common.black',
                                                    }
                                                }}
                                                placeholder={t("editional.reply")}
                                                inputProps={{
                                                    readOnly: !isEdit,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        isEdit ?
                                                            <MyCustomButton
                                                                height='30px'
                                                                backgroundColor={"rgb(5, 69, 19, 0.5)"}
                                                                borderColor='rgb(5, 69, 19, 0.1)'
                                                                fontColor='#fff'
                                                                borderWeight={0.5}
                                                                fontSize={14}
                                                                onClick={() =>
                                                                    handleReplyCommentSubmit()
                                                                }
                                                                content={t("editional.send")}
                                                            /> :
                                                            <MyCustomButton
                                                                height='30px'
                                                                backgroundColor={"rgb(139, 69, 19,0.1)"}
                                                                borderColor='rgb(139, 69, 19,0.1)'
                                                                fontColor='primary.main'
                                                                borderWeight={0.5}
                                                                fontSize={14}
                                                                onClick={() =>
                                                                    setIsEdit(true)
                                                                }
                                                                content={t("editional.edit")}
                                                            />
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                            <Typography whiteSpace={'nowrap'} fontStyle={"italic"} textAlign={'start'} fontWeight={'400'} fontSize={'12px'}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    },
                                                }}
                                                onClick={() => setIsReply(true)}
                                            >{t("editional.reply")}</Typography>
                                        </Box>
                                    )
                                ) : (
                                    replyComment &&
                                    <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                        <Typography whiteSpace={'nowrap'} textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{t("editional.owner")}</Typography>
                                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} alignItems={"center"} gap={'4px'}>
                                            <TextField
                                                fullWidth
                                                value={replyCommentTextField}
                                                onChange={handleReplyCommentChange}
                                                size='small'
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: "8px",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                        '&:hover fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        color: 'common.black',
                                                    }
                                                }}
                                                inputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            {/* thời gian bình luận */}
                                        </Box>
                                    </Box>
                                )

                            }
                            {
                                replyComment &&
                                <Typography textAlign={'end'} width={"100%"} fontWeight={'400'} fontStyle={"italic"} fontSize={'12px'}>{getPreviousTimeRelative(props.dateReplyComment || "", t)}</Typography>
                            }
                        </Box>
                    </> : <>
                        <Box width={isMobile ? "100%" : "100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'8px'}>
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"start"} gap={'4px'}>
                                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"start"} gap={'4px'}>
                                    <Avatar size={60} src={avatar} />
                                    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'4px'}>
                                        <Typography textAlign={'start'} fontWeight={'500'} fontSize={'16px'}>{name}</Typography>
                                        {
                                            /* Rating */
                                        }
                                        <Rating name="read-only" value={rating} readOnly />
                                    </Box>
                                </Box>
                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"end"} gap={'4px'}>
                                    {
                                        /* Thời gian đăng */
                                    }
                                    <Typography textAlign={'start'} fontWeight={'400'} fontSize={'12px'}>{getPreviousTimeRelative(dateComment || "", t)}</Typography>                        {
                                        /* Read more */
                                    }
                                    {props.isDetail &&
                                        <MyIcon
                                            icon={
                                                <ReadMore />
                                            }
                                            position='bottom'
                                            hasTooltip
                                            tooltipText={t("favourite.item.view")}
                                            onClick={() => {

                                                props.isOwner ?
                                                    navigate(`/${ROUTES.booking.detail_owner}/${props.bookingId}`) :
                                                    navigate(`/${ROUTES.booking.detail}/${props.bookingId}`)

                                            }}
                                        />}

                                </Box>

                            </Box>
                            {
                                /* Comment */
                            }
                            <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"start"} gap={'4px'} sx={{
                                    borderRadius: '8px',
                                    border: '1px solid #E0E0E0',
                                    padding: '6px' // Adjust padding as needed
                                }}>
                                    <Typography textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{comment}</Typography>
                                </Box>
                            </Box>
                            {
                                /* Reply Comment */
                            }
                            {/* {replyComment && */}
                            {
                                props.isOwner ? (
                                    isReply ? (
                                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>

                                            <Typography whiteSpace={'nowrap'} textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{t("editional.owner")}</Typography>
                                            <TextField
                                                fullWidth
                                                value={replyCommentTextField}
                                                onChange={handleReplyCommentChange}
                                                size='medium'
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: "8px",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                        '&:hover fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        color: 'common.black',
                                                    }
                                                }}
                                                placeholder={t("editional.reply")}
                                                inputProps={{
                                                    readOnly: !isEdit,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        isEdit ?
                                                            <MyCustomButton
                                                                height='30px'
                                                                backgroundColor={"rgb(5, 69, 19, 0.5)"}
                                                                borderColor='rgb(5, 69, 19, 0.1)'
                                                                fontColor='#fff'
                                                                borderWeight={0.5}
                                                                fontSize={14}
                                                                onClick={() =>
                                                                    handleReplyCommentSubmit()
                                                                }
                                                                content={t("editional.send")}
                                                            /> :
                                                            <MyCustomButton
                                                                height='30px'
                                                                backgroundColor={"rgb(139, 69, 19,0.1)"}
                                                                borderColor='rgb(139, 69, 19,0.1)'
                                                                fontColor='primary.main'
                                                                borderWeight={0.5}
                                                                fontSize={14}
                                                                onClick={() =>
                                                                    setIsEdit(true)
                                                                }
                                                                content={t("editional.edit")}
                                                            />
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                            <Typography whiteSpace={'nowrap'} fontStyle={"italic"} textAlign={'start'} fontWeight={'400'} fontSize={'12px'}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    },
                                                }}
                                                onClick={() => setIsReply(true)}
                                            >{t("editional.reply")}</Typography>
                                        </Box>
                                    )
                                ) : (
                                    replyComment &&
                                    <Box width={"100%"} display={"flex"} flexDirection={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={'8px'}>
                                        <Typography whiteSpace={'nowrap'} textAlign={'start'} fontWeight={'400'} fontSize={'14px'}>{t("editional.owner")}</Typography>
                                        <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"flex-start"} alignItems={"center"} gap={'4px'}>
                                            <TextField
                                                fullWidth
                                                value={replyCommentTextField}
                                                onChange={handleReplyCommentChange}
                                                size='small'
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: "8px",
                                                            border: "1px solid #e0e0e0",
                                                        },
                                                        '&:hover fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: "1px solid #e0e0e0"
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        color: 'common.black',
                                                    }
                                                }}
                                                inputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            {/* thời gian bình luận */}
                                        </Box>
                                    </Box>
                                )

                            }
                            {
                                replyComment &&
                                <Typography textAlign={'end'} width={"100%"} fontWeight={'400'} fontStyle={"italic"} fontSize={'12px'}>{getPreviousTimeRelative(props.dateReplyComment || "", t)}</Typography>
                            }
                        </Box>
                    </>
            }
        </Box>
    </Box>
    );
}
