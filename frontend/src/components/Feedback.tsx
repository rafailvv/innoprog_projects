import { Box, Typography } from '@mui/material'
import LikeBtn from './LikeBtn'
import DislikeBtn from './DislikeBtn'
import { FeedbackItem } from '../models/types'

function Feedback({ feedback }: { feedback: FeedbackItem }) {
    return (
        <Box textAlign={"left"}>
            <Typography variant="h6" fontWeight="bold">
                Фидбек от {feedback.user.first_name}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
                Оценка: {feedback.grade}
            </Typography>
            <Typography variant="body1">
                Коментарий: {feedback.comment}
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
        </Box>
    )
}

export default Feedback