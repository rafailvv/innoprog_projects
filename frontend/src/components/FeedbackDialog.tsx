import { Button, Dialog, DialogContent, DialogTitle, Slider, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { FeedbackRequest, SubmissionItem } from "../models/types";
import ApiService from "../services/ApiService";
import { AxiosError } from "axios";

export interface SimpleDialogProps {
    open: boolean;
    submissionId: number;
    submission: SubmissionItem;
    onClose: (value: FeedbackRequest) => void;
}

function FeedbackDialog(props: SimpleDialogProps) {
    const { onClose, open, submissionId, submission } = props;
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
            if (e as AxiosError && e.response?.status === 400) setErrorText(e.response.data.error)
            console.error(e)
        }
    }

    const onDownload = () => {
        const link = document.createElement("a");
        link.href = submission.file;
        link.click();
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <DialogTitle variant="h5">ОБРАТНАЯ СВЯЗЬ</DialogTitle>
            <DialogContent>
                <Typography variant="h6" fontWeight={'bold'}>Ссылка на код решения</Typography>
                <TextField fullWidth disabled label={submission.github}/>

                <Typography variant="h6" fontWeight={'bold'}>Файл с решением</Typography>
                <Button variant="contained" onClick={onDownload} disabled={submission?.file === null}>
                    Скачать файл
                </Button>

                <Typography variant="h6" fontWeight={'bold'}>Комментарий</Typography>
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
                    // sx={{ mb: 2 }}
                />
                <Typography variant="h6" fontWeight={'bold'}>Оцените от 1 до 5</Typography>

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