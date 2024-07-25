import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckPointItem, FeedbackItem, ProjectItem, SubmissionItem } from "../models/types";
import { useLocation } from "react-router-dom";
import ApiService from "../services/ApiService";



function CheckPoint() {
    const [project, setProject] = useState<ProjectItem>();
    const [checkPoint, setCheckPoint] = useState<CheckPointItem>();
    const [submissions, setSubmissions] = useState<SubmissionItem[]>();
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [submissionText, setSubmissionText] = useState('');
    const innerCheckpointId = useLocation().state.id;

    useEffect(() => {
        const domains = window.location.pathname.split("/");
        const checkpointId = domains.pop();
        const projectId = domains.pop();
        console.log(checkpointId, projectId);
        if (!projectId) return;
        if (!checkpointId) return;
        ApiService.getProjectById(parseInt(projectId)).then(response => setProject(response.data)).catch(err => console.error(err));
        ApiService.getCheckPointsByProjectId(parseInt(projectId))
            .then(response => setCheckPoint(response.data[innerCheckpointId]))
            .catch(err => console.error(err));
        ApiService.getSubmissionsByCheckPointId(parseInt(checkpointId)).then(response => {
            setSubmissions(response.data);
        }).catch(err => console.error(err));
    }, [])
    useEffect(() => {
        if (!submissions) return;
        console.log(submissions);
        for (const sub of submissions) {
            ApiService.getFeedbacksBySubmissionId(sub.id).then(response => setFeedbacks(response.data)).catch(err => console.error(err));
        }

    }, [submissions])
    return (
        <>
            <Typography variant="h4" gutterBottom>{project?.name}</Typography>
            <Typography variant="h5" gutterBottom>Check point {innerCheckpointId + 1}</Typography>
            <Typography>Очков {checkPoint?.points}</Typography>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">{checkPoint?.description}</Typography>
            <Typography variant="h6">Feedback</Typography>
            <List>
                {feedbacks.map((value) =>
                    <ListItem key={value.id}>
                        <ListItemText primary={value.user + ' - ' + value.date_time + ' - ' + value.grade} secondary={value.comment} />
                    </ListItem>
                )}
            </List>
            <Typography variant="h5" gutterBottom>Ссылка на гит/файл</Typography>
            <TextField id="standard-basic" label="Git" variant="standard" value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
            <Box display="flex" flexDirection="column" gap="10px" margin="10px">
                <Button variant="contained" onClick={() => {
                    if (checkPoint === undefined) return;
                    ApiService.postSubmissionByCheckPointId(checkPoint?.id, "test", submissionText)
                    .then(response => {
                        console.log(response.data);
                    }).catch(err => console.error(err));
                    setSubmissionText('');
                }}>Проверить</Button>
                <Button variant="contained" disabled>
                    Пройдено
                </Button>
            </Box>
        </>
    );
}

export default CheckPoint;