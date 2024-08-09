import { Box, Button, List, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckPointItem, FeedbackItem, ProjectItem, SubmissionItem } from "../models/types";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import Feedback from "../components/Feedback";
import Submission from "../components/Submission";

interface Like {
    count: number;
    pressed: boolean;
}

function CheckPoint() {
    const [project, setProject] = useState<ProjectItem>();
    const [checkPoint, setCheckPoint] = useState<CheckPointItem>();
    const [userSubmissions, setUserSubmissions] = useState<SubmissionItem[]>();
    const [otherSubmissions, setOtherSubmissions] = useState<SubmissionItem[]>();
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [submissionText, setSubmissionText] = useState('');
    const innerCheckpointId = useLocation().state.id;

    const [likes, setLikes] = useState<Like[]>([]);


    useEffect(() => {
        const domains = window.location.pathname.split("/");
        const checkpointId = domains.pop();
        const projectId = domains.pop();
        // console.log(checkpointId, projectId);
        if (!projectId) return;
        if (!checkpointId) return;
        ApiService.getProjectById(parseInt(projectId))
            .then(response => setProject(response.data))
            .catch(err => console.error(err));
        ApiService.getCheckPointsByProjectId(parseInt(projectId))
            .then(response => setCheckPoint(response.data[innerCheckpointId]))
            .catch(err => console.error(err));

        ApiService.getSubmissionsByCheckPointId(parseInt(checkpointId))
            .then(response => {
                console.log(response.data)
                setUserSubmissions(response.data.user_submissions)
                // if(response.data.user_submissions.length > 0) {
                //     setSubmissionText(response.data.user_submissions[0].github)
                // }
                setOtherSubmissions(response.data.other_submissions.filter(sub => sub.accepted && sub.is_visible || sub.user.teacher))
            })
            .catch(err => console.error(err));

        // ApiService.getSubmissionsByCheckPointId(parseInt(checkpointId)).then(response => {
        //     // setUserSubmissions(response.data);
        // });
    }, [])
    useEffect(() => {
        if (!userSubmissions) return;
        // console.log(submissions);
        for (const sub of userSubmissions) {
            ApiService.getFeedbacksBySubmissionId(sub.id)
                .then(response => {
                    setFeedbacks([...feedbacks, ...response.data]);
                    setLikes([...likes, ...response.data.map(feedback => { return { count: feedback.like, pressed: false } })])
                })
                .catch(err => console.error(err));
        }
    }, [userSubmissions])
    // console.log(feedbacks)
    // console.log(innerCheckpointId)
    const navigator = useNavigate();
    return (
        <>
            <Button onClick={() => { navigator(-1); }}> Назад</Button>
            <Typography variant="h4" gutterBottom>{project?.name}</Typography>
            <Typography variant="h5" fontWeight="bold">Чек-поинт {innerCheckpointId + 1} - {checkPoint?.name}</Typography>
            <Typography gutterBottom variant="body1">Очков: {checkPoint?.points}</Typography>
            <Typography variant="h6" fontWeight={"bold"}>Описание</Typography>
            <Typography gutterBottom variant="body1">{checkPoint?.description}</Typography>
            <Typography variant="h6" fontWeight={"bold"}>Отзывы</Typography>
            <List>
                {feedbacks.map((value) =>
                    <Feedback key={value.id} feedback={value} />
                )}
            </List>

            <Typography variant="h6" fontWeight={"bold"}>Мои решения</Typography>
            <List>
                {userSubmissions?.map((value) =>
                    <Typography key={value.id}>{value.github}</Typography>
                )}
            </List>

            <Typography variant="h6" fontWeight={"bold"}>Чужие решения</Typography>
            <List>
                {otherSubmissions?.map((value) =>
                    <Submission key={value.id} submission={value} />
                )}
            </List>

            <Typography variant="h5" gutterBottom>Ссылка на код решения</Typography>

            <TextField id="standard-basic"
                // disabled={userSubmissions?.length !== 0}
                fullWidth
                label="Git"
                variant="outlined"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
            />
            <Box display="flex" flexDirection="column" gap="10px" margin="10px">
                <Tooltip title="Чтобы завершить решение, необходимо, чтобы был оставлено хотя бы два отзыва с оценкой 4 или 5">

                    <Button variant="contained" onClick={() => {
                        if (checkPoint === undefined) return;
                        ApiService.postSubmissionByCheckPointId(checkPoint?.id, submissionText, "test")
                            .then(response => {
                                console.log(response.data);
                            }).catch(err => console.error(err));
                        setSubmissionText('');
                    }}>Проверить</Button>
                </Tooltip>

                <Button variant="contained" color="success" disabled={feedbacks?.filter(value => value.grade >= 4).length < 2}>
                    Пройдено
                </Button>
            </Box>
        </>
    );
}

export default CheckPoint;