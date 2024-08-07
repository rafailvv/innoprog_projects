import { Button, Dialog, DialogContent, DialogTitle, Slider, TextField } from "@mui/material"
import { useState } from "react";
import { FeedbackRequest } from "../models/types";
import ApiService from "../services/ApiService";
import { AxiosError } from "axios";

export interface SimpleDialogProps {
    open: boolean;
    submissionId: number;
    onClose: (value: FeedbackRequest) => void;
}

function FeedbackDialog(props: SimpleDialogProps) {
    const { onClose, open, submissionId } = props;
    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState(4);
    const [errorText, setErrorText] = useState('');

    const handleClose = () => {
        onClose({
            comment: comment,
            grade: grade
        });
    };
    const sendFeedback = async () => {
        try {
            const response = await ApiService.postFeedbackBySubmissionId(submissionId, {
                comment: comment,
                grade: grade
            })
            console.log(response.data)
            setComment('')
            handleClose()
        } catch (e: any) {
            if(e as AxiosError && e.response?.status === 400) setErrorText(e.response.data.error)
            console.error(e)
        }
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Обратная связь</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    value={comment}
                    margin="dense"
                    id="comment"
                    label="Комментарий"
                    type="string"
                    fullWidth
                    multiline
                    rows={4}
                    onChange={(e) => setComment(e.target.value)}
                    helperText={errorText}
                    sx={{ mb: 5 }}
                />
                <Slider
                    aria-label="Grade"
                    value={grade}
                    step={1} min={1} max={5}
                    valueLabelDisplay="on"
                    onChange={(_, value) => setGrade(value as number)} />
                <Button fullWidth variant="contained" type="submit" onClick={sendFeedback}>Отправить</Button>
            </DialogContent>
            {/* <DialogActions>
                
            </DialogActions> */}
        </Dialog>
    )
}

export default FeedbackDialog