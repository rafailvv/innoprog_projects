import { ThumbDown, ThumbUp } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import ApiService from '../services/ApiService';

function LikeBtn({ submissionId, likeCount, dislikeCount }: { submissionId: number, likeCount: number, dislikeCount: number }) {
    const [pressed, setPressed] = useState<boolean>(likeCount > 0);
    const [pressedDislike, setPressedDislike] = useState<boolean>(dislikeCount > 0);

    const addLike = async () => {
        try {
            const resp = await ApiService.postLikeByFeedbackId(submissionId, pressed ? -1 : 1)
            if (!pressed && pressedDislike) {
                await addDislike();
            }
            setPressed(!pressed);
            console.log(resp)
        } catch (error) {
            console.error(error);
        }
    }
    
    const addDislike = async () => {
        try {
            const resp = await ApiService.postDislikeByFeedbackId(submissionId, pressedDislike ? -1 : 1)
            if (!pressedDislike && pressed) {
                await addLike();
            }
            setPressedDislike(!pressedDislike);
            console.log(resp);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <IconButton color={pressed ? "primary" : "default"} onClick={addLike}>
                <ThumbUp />
            </IconButton>

            <IconButton color={pressedDislike ? "primary" : "default"} onClick={addDislike}>
                <ThumbDown />
            </IconButton>
        </>
    )
}

export default LikeBtn