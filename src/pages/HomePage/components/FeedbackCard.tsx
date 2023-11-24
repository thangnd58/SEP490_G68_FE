import { Feedback, FeedbackRequest } from "../../../utils/type";
import { Box, Typography, Rating, Avatar, IconButton, TextField, Tooltip } from '@mui/material';
import theme from '../../../utils/theme';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAction';
import { useEffect, useState, useContext } from "react";
import { getUserInfo } from '../../../redux/reducers/authReducer';
import { SendRounded,ModeEdit, Info } from "@mui/icons-material";
import ToastComponent from "../../../components/toast/ToastComponent";
import { FeedbackService } from "../../../services/FeedbackService";
import { useFormik } from "formik";
import * as Yup from "yup";
import usei18next from "../../../hooks/usei18next";
import { ReportFormModal } from "../../ReportComponent/ReportFormModal";
import { ModalContext } from "../../../contexts/ModalContext";


export default function FeedbackCard(props: {
    feedback: Feedback;
    userId : number;
    motorbikeId : string;

}) {
    const { user } = useAppSelector((state: any) => state.userInfo);
    const [showEditComment, setShowEditComment] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { t } = usei18next();
    const { setContentModal } = useContext(ModalContext)

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUserInfo());
      }, []);



    const formik = useFormik({
        initialValues: {
            comment: props.feedback.response?.comment || "rrrr"
        },
        validationSchema: Yup.object({
            comment: Yup.string().required(t("form.required")),
        }),
        onSubmit: async (values) => {
            try {
                if (props.feedback.response) {
                    const feedbackReq: FeedbackRequest = {
                        rating: 5,
                        comment: values.comment
                    }
                    const res = await FeedbackService.putFeedback(props.feedback.response.feedbackId.toString(), feedbackReq)
                    ToastComponent(t("feedback.editSuccess"), "success")
                } else {
                    const feedbackReq: FeedbackRequest = {
                        bookingId: props.feedback.bookingId || 0,
                        motorbikeId: Number(props.motorbikeId) || 0,
                        rating: 5,
                        comment: values.comment
                    }
                    const res = await FeedbackService.postFeedback(feedbackReq)
                    ToastComponent(t("feedback.createSuccess"), "success")
                }
                // if (props.setReload) {
                //     props.setReload((prev) => !prev)
                // }
            } catch (error) {
                ToastComponent(t("feedback.createError"), "error")
            }
        }
    }
    );


    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue
    } = formik;

    return (
        
        
                <Box
                    borderTop={'1px solid #A26A42'}
                    padding={'8px'}
                    // justifyContent={'space-between'}
                    display={'flex'}
                    flexDirection={'column'}
                    width={'95%'}
                    gap={'8px'}
                >
                    <Box display={'flex'} flexDirection={'row'}>
                        <Box width={'50px'}>
                            <Avatar
                                  sx={{
                                      marginLeft : "5px",
                                      marginTop : "3px",
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                  }}
                                  src={props.feedback.user.avatarUrl}
                            />
                        </Box>
                        <Box width={'90%'}>
                            <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                <Typography
                                    fontWeight="bold"
                                    marginLeft={'4px'}
                                    fontSize="16px"
                                    color={theme.palette.text.primary}
                                >{props.feedback.user.name}</Typography>
                                <Rating
                                    name="simple-controlled"
                                    value={props.feedback.rating}
                                    size='medium'
                                    readOnly = {true}
                                    // disabled={!isEdit}
                                    // onChange={(event, newValue) => {
                                    //     setValue(newValue!);
                                    // }}
                                />
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                <Typography
                                    marginLeft={'4px'}
                                    marginTop={'6px'}
                                    fontSize="16px"
                                    color={theme.palette.text.primary}
                                >{props.feedback.comment}</Typography>
      
                            </Box>
                            
                            <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'} marginLeft={'25px'} marginTop={'5px'}>
                                {!props.feedback.response ? 
                                <a onClick={() => setIsEdit(true)} style={{cursor: 'pointer'}} >{t("feedback.reply")}</a>
                                :
                                // <Typography color={'#FFFFFF'}>Phản hồi</Typography>
                                null
                                }
                                {/* <Typography sx={{cursor : 'pointer'}}>Báo cáo</Typography> */}
                            </Box>
                        </Box>
                        <Box width={'5%'}>
                            <Tooltip title={t("booking.toolTipReport")}>
                                            <Info sx={{
                                                cursor: 'pointer',
                                                color: '#8B4513',
                                                '&:hover': {
                                                    transform: "scale(1.1)",
                                                    transition: "transform 0.1s ease-in-out",
                                                },
                                            }} onClick={() => setContentModal(<ReportFormModal />)} />
                            </Tooltip>
                        </Box>
                    </Box>
                    
                    {props.feedback.response && !isEdit ? // nếu có comment trả lời
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        {/* Show nội dung trả lời */}
                        <Box
                            borderTop={'1px solid #e0e0e0'}
                            padding={'8px'}
                            // justifyContent={'space-between'}
                            // borderRadius={'5px'}
                            display={'flex'}
                            flexDirection={'row'}
                            width={'90%'}
                            gap={'8px'}
                        >
                            <Box width={'50px'}>
                                <Avatar
                                    sx={{
                                        marginLeft : "5px",
                                        marginTop : "3px",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                    }}
                                    src={props.feedback.response.user.avatarUrl}
                                />
                            </Box>
                            <Box width={"100%"} display={'flex'} flexDirection={'row'} gap={'8px'} justifyContent={'space-between'}>
                                <Box width={'90%'}>
                                    <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                        <Typography
                                            fontWeight="bold"
                                            marginLeft={'4px'}
                                            fontSize="16px"
                                            color={theme.palette.text.primary}
                                        >{props.feedback.response.user.name}</Typography>
                                    </Box>
                                    <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                        <Typography
                                            marginLeft={'4px'}
                                            marginTop={'6px'}
                                            fontSize="16px"
                                            color={theme.palette.text.primary}
                                        >{props.feedback.response.comment}</Typography>
                                    </Box>
                                </Box>
                                <Box >   
                                    <IconButton
                                                onClick={() => { setIsEdit(true) }}>
                                                <ModeEdit sx={{ color: "common.black" }} />
                                    </IconButton>
                                </Box>
                            </Box>      
                        </Box>
                    </Box>
                    :
                    
                    props.userId === user.userId || isEdit? // nếu chủ xe truy cập vào và chưa có comment trả lời
                    
                    <Box display={'flex'} justifyContent={'flex-end'}>
                        <Box display={'flex'} flexDirection={'column'} width={'90%'}>
                            

                            {/* thêm mới phản hồi */}
                            {isEdit ? 
                                <Box
                                    borderTop={'1px solid #e0e0e0'}
                                    padding={'8px'}
                                    // justifyContent={'space-between'}
                                    // borderRadius={'5px'}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    gap={'8px'}
                                >
                                    <TextField
                                    fullWidth
                                    name="comment"
                                    value={values.comment}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderRadius: "8px",
                                                border: "1px solid #e0e0e0",
                                            },
                                            '&:hover fieldset': {
                                                border: "1px solid #8b4513"
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: "1px solid #8b4513"
                                            },
                                        },
                                    }}
                                    inputProps={{
                                        readOnly: !isEdit,
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                                <IconButton 
                                                onClick={() => {
                                                    setIsEdit(false)
                                                    handleSubmit()
                                                }}
                                                >
                                                    <SendRounded sx={{ color: "common.black", transform: "rotate(-30deg)" }} />
                                                </IconButton> 
                                        ),
                                    }}
                                />
                                
                                {/* {errors.comment && touched.comment && (
                                    <ErrorMessage message={errors.comment} />
                                )} */}
                                    {/* <Box width={'50px'}>
                                        <Avatar
                                            sx={{
                                                marginLeft : "5px",
                                                marginTop : "3px",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                            }}
                                            // src={props.feedback.response.user.avatarUrl}
                                        />
                                    </Box>
                                    <Box>
                                    <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                            <Typography
                                                fontWeight="bold"
                                                marginLeft={'4px'}
                                                fontSize="16px"
                                                color={theme.palette.text.primary}
                                            >{props.feedback.user.avatarUrl}</Typography>
                                        </Box>
                                        <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
                                            <Typography
                                                marginLeft={'4px'}
                                                marginTop={'6px'}
                                                fontSize="16px"
                                                color={theme.palette.text.primary}
                                            >{props.feedback.comment}</Typography>
                
                                        </Box>
                                    </Box> */}
                                </Box>
                            :
                                null                
                            }
                            
                        </Box>
                    </Box>
                    :
                    null
                    }
                            
                </Box>

//                         <Box>
//     <Box
//                             // borderTop={'1px solid #A26A42'}
                            
//                             padding={'8px'}
                            
//                             // justifyContent={'space-between'}
//                            display={'flex'}
//                             flexDirection={'column'}
//                             width={'95%'}
//                             gap={'8px'}
//                             marginBottom={'10px'}
//                             marginTop={'5px'}
//                         >
//                             <Box display={'flex'}
//                             flexDirection={'row'}>
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.user.name}</Typography>
//                                 <Rating
//                                     name="simple-controlled"
//                                     value={props.feedback.rating}
//                                     size='medium'
//                                     readOnly = {true}
//                                     // disabled={!isEdit}
//                                     // onChange={(event, newValue) => {
//                                     //     setValue(newValue!);
//                                     // }}
//                                 />
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.comment}</Typography>
      
//                             </Box>
//                           </Box>
//                           </Box>
//                           <Box display={'flex'} justifyContent={'flex-end'}>
//                           <Box
//                             borderTop={'1px solid #e0e0e0'}
//                             padding={'8px'}
//                             // justifyContent={'space-between'}
//                             display={'flex'}
//                             flexDirection={'row'}
//                             width={'90%'}
//                             gap={'8px'}
//                         >
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.response.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.user.name}</Typography>
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.comment}</Typography>
      
//                             </Box>
//                           </Box>
                            
//                         </Box>
//                         </Box>
                            
//                         </Box>
//                         <Box
//                             borderTop={'1px solid #A26A42'}
                            
//                             padding={'8px'}
                            
//                             // justifyContent={'space-between'}
//                            display={'flex'}
//                             flexDirection={'column'}
//                             width={'95%'}
//                             gap={'8px'}
//                         >
//                             <Box display={'flex'}
//                             flexDirection={'row'}>
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.user.name}</Typography>
//                                 <Rating
//                                     name="simple-controlled"
//                                     value={props.feedback.rating}
//                                     size='medium'
//                                     readOnly = {true}
//                                     // disabled={!isEdit}
//                                     // onChange={(event, newValue) => {
//                                     //     setValue(newValue!);
//                                     // }}
//                                 />
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.comment}</Typography>
      
//                             </Box>
//                           </Box>
//                           </Box>
//                           <Box display={'flex'} justifyContent={'flex-end'}>
//                           <Box
//                             borderTop={'1px solid #e0e0e0'}
//                             padding={'8px'}
//                             // justifyContent={'space-between'}
//                             display={'flex'}
//                             flexDirection={'row'}
//                             width={'90%'}
//                             gap={'8px'}
//                         >
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.response.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.user.name}</Typography>
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.comment}</Typography>
      
//                             </Box>
//                           </Box>
                            
//                         </Box>
//                         </Box>
                            
//                         </Box>
//                         <Box
//                             borderTop={'1px solid #A26A42'}
                            
//                             padding={'8px'}
                            
//                             // justifyContent={'space-between'}
//                            display={'flex'}
//                             flexDirection={'column'}
//                             width={'95%'}
//                             gap={'8px'}
//                         >
//                             <Box display={'flex'}
//                             flexDirection={'row'}>
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.user.name}</Typography>
//                                 <Rating
//                                     name="simple-controlled"
//                                     value={props.feedback.rating}
//                                     size='medium'
//                                     readOnly = {true}
//                                     // disabled={!isEdit}
//                                     // onChange={(event, newValue) => {
//                                     //     setValue(newValue!);
//                                     // }}
//                                 />
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.comment}</Typography>
      
//                             </Box>
//                           </Box>
//                           </Box>
//                           <Box display={'flex'} justifyContent={'flex-end'}>
//                           <Box
//                             borderTop={'1px solid #e0e0e0'}
//                             padding={'8px'}
//                             // justifyContent={'space-between'}
//                             display={'flex'}
//                             flexDirection={'row'}
//                             width={'90%'}
//                             gap={'8px'}
//                         >
//                           <Box width={'50px'}>
//                             <Avatar
//                                   sx={{
//                                       marginLeft : "5px",
//                                       marginTop : "3px",
//                                       width: "40px",
//                                       height: "40px",
//                                       borderRadius: "50%",
//                                   }}
//                                   src={props.feedback.response.user.avatarUrl}
//                               />
//                           </Box>
//                           <Box>
//                           <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     fontWeight="bold"
//                                     marginLeft={'4px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.user.name}</Typography>
//                             </Box>
//                             <Box display={'flex'} flexDirection={'column'} gap={'8px'} alignItems={'start'}>
//                                 <Typography
//                                     marginLeft={'4px'}
//                                     marginTop={'6px'}
//                                     fontSize="16px"
//                                     color={theme.palette.text.primary}
//                                 >{props.feedback.response.comment}</Typography>
      
//                             </Box>
//                           </Box>
                            
//                         </Box>
//                         </Box>
                            
//                         </Box>
// </Box>
    );

}
