import { Avatar, Box, Paper, Typography } from '@mui/material'
import LikeBtn from './LikeBtn'
import { FeedbackItem } from '../models/types'

function Feedback({ feedback }: { feedback: FeedbackItem }) {
    const user = feedback.user
    const date = new Date(feedback.date_time)
    // console.log(feedback.date_time, date.toDateString());
    
    return (
        <Paper elevation={10} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
            <Box display={'flex'} alignItems={'center'} gap={1}>
                <Avatar src={user.photo_fase} sx={{ width: 50, height: 50 }} />
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography variant="h5" fontWeight="bold">
                        {user.first_name}
                    </Typography>
                    <Typography variant="body2">
                        {user.position}
                    </Typography>
                </Box>
                <Paper sx={{ ml: 'auto',backgroundColor: 'primary.main', borderRadius: "10px", p: "10px", pl: "20px", pr: "20px"}} elevation={0}>
                    <Typography variant="h4" ml={'auto'} fontWeight="bold" color={'white'}>
                        {feedback.grade}
                    </Typography>
                </Paper>
            </Box>
            <Typography variant="h5" fontWeight="bold">
                Комментарий
            </Typography>
            <Typography variant="h6" fontStyle={'italic'}>
                {feedback.comment}
            </Typography>

            {/* <Typography variant="body1">
                Id посылки: {feedback.submission.id}
            </Typography> */}
            <Typography variant="body1">
                {date.toLocaleString()}
            </Typography>
            <Typography variant="body1">
                <LikeBtn submissionId={feedback.id} likeCount={feedback.like} dislikeCount={feedback.dislike} />
            </Typography>
        </Paper>
    )
}

export default Feedback