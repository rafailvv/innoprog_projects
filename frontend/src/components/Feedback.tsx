import { Avatar, Box, Paper, Typography } from '@mui/material'
import LikeBtn from './LikeBtn'
import DislikeBtn from './DislikeBtn'
import { FeedbackItem } from '../models/types'

function Feedback({ feedback }: { feedback: FeedbackItem }) {
    const user = feedback.user
    return (
        <Paper elevation={10} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
            <Box display={'flex'} alignItems={'center'} gap={1}>
                <Avatar src={user.photo_fase} sx={{ width: 50, height: 50 }} />
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography variant="h5" fontWeight="bold">
                        {user.first_name}
                    </Typography>
                    <Typography variant="h6" fontStyle={'italic'}>
                        {user.position}
                    </Typography>
                </Box>
                <Typography variant="h4" ml={'auto'} fontWeight="bold">
                    {feedback.grade}
                </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
                Комментарий
            </Typography>
            <Typography variant="h6" fontStyle={'italic'}>
                {feedback.comment}
            </Typography>

            <Typography variant="body1">
                Id посылки: {feedback.submission.id}
            </Typography>
            <Typography variant="caption">
                Дата и время: {feedback.date_time}
            </Typography>
            <Typography variant="body1">
                <LikeBtn submissionId={feedback.id} count={feedback.like} />
                <DislikeBtn submissionId={feedback.id} count={feedback.dislike} />
            </Typography>
        </Paper>
    )
}

export default Feedback