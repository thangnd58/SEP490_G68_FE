import { Feedback } from "../../../utils/type";
import { Box, Typography, Rating, Avatar } from '@mui/material';
import theme from '../../../utils/theme';

export default function FeedbackCard(props: {
    feedback: Feedback;
}) {

    return (
        <Box
            border={'1px solid #A26A42'}
            padding={'8px'}
            // justifyContent={'space-between'}
            borderRadius={'8px'}
            display={'flex'}
            flexDirection={'row'}
            width={'95%'}
            gap={'8px'}
        >
            <Box width={'50px'}>
                <Avatar
                    sx={{
                        marginLeft: "5px",
                        marginTop: "3px",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                    }}
                    src={props.feedback.user.avatarUrl}
                />
            </Box>
            <Box>
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
                        readOnly={true}
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
            </Box>


        </Box>
    );

}
