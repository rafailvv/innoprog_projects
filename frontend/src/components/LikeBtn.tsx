import { ThumbUp } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useState } from 'react'
import ApiService from '../services/ApiService';

function LikeBtn({ submissionId, count }: { submissionId: number, count: number }) {
    const [pressed, setPressed] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(count);
    return (
        <Button variant={pressed ? "contained" : "outlined"} disableElevation disableFocusRipple startIcon={<ThumbUp />} sx={{ marginRight: "10px" }} onClick={
            () => {
                pressed ? setLikes(likes - 1) : setLikes(likes + 1);
                setPressed(!pressed);
                ApiService.postLikeByFeedbackId(submissionId, pressed ? -1 : 1)
            }
        }>
            {likes}
        </Button>
    )
}

export default LikeBtn