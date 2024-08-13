import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material"
import Header from "../components/Header"
import { useLocation, useNavigate } from "react-router-dom";
import { FeedbackItem, SubmissionItem } from "../models/types";
import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import Feedback from "../components/Feedback";

function Submission() {
    const navigator = useNavigate();
    const submission = useLocation().state.submission as SubmissionItem;

    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

    useEffect(() => {
        ApiService.getFeedbacksBySubmissionId(submission.id)
            .then(response => {console.log(response.data); setFeedbacks(response.data);})
            .catch(err => console.error(err));
    }, [])


    return (
        <Box>
            <Header changeProjectsTab={() => { }} />
            <Container>
                <Button onClick={() => { navigator(-1); }}> Мои решения </Button>

                {/* <Typography variant="h4" fontWeight="bold" gutterBottom>{checkPoint?.name.toUpperCase()}</Typography> */}
                <Typography variant="h5" fontWeight={"bold"}>Название решения</Typography>
                <TextField
                    value={submission?.name}
                    disabled
                    fullWidth
                />

                <Typography variant="h5" fontWeight={"bold"}>Файл с решением</Typography>
                <input type="file" disabled />

                <Typography variant="h5" fontWeight={"bold"}>Ссылка на код решения</Typography>
                <TextField
                    value={submission?.github}
                    disabled
                    fullWidth
                />

                <Typography variant="h5" fontWeight={"bold"} gutterBottom>Комментарии</Typography>
                <Stack>
                    {feedbacks.map((value) =>
                        <Feedback key={value.id} feedback={value} />
                    )}
                </Stack>


            </Container>
        </Box>
    )
}

export default Submission