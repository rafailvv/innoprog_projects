import { Box, Button, List, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckPointItem, FeedbackItem, ProjectItem, SubmissionItem } from "../models/types";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import LikeBtn from "../components/LikeBtn";
import DislikeBtn from "../components/DislikeBtn";

interface Like {
    count: number;
    pressed: boolean;
}

function CheckPoint() {
    const [project, setProject] = useState<ProjectItem>();
    const [checkPoint, setCheckPoint] = useState<CheckPointItem>();
    const [submissions, setSubmissions] = useState<SubmissionItem[]>();
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
        // console.log(submissions);
        for (const sub of submissions) {
            ApiService.getFeedbacksBySubmissionId(sub.id).then(response => {
                setFeedbacks([...feedbacks, ...response.data]);
                setLikes([...likes, ...response.data.map(feedback => {return {count:feedback.like, pressed:false}})])
            }).catch(err => console.error(err));
        }

    }, [submissions])
    console.log(feedbacks)
    const navigator = useNavigate();
    return (
        <>
            <Button onClick={() => { navigator(-1); }}> Назад</Button>
            <Typography variant="h4" gutterBottom>{project?.name}</Typography>
            <Typography variant="h5" fontWeight="bold">Чек-поинт {innerCheckpointId + 1}</Typography>
            <Typography gutterBottom variant="body1">Очков: {checkPoint?.points}</Typography>
            <Typography variant="h6" fontWeight={"bold"}>Описание</Typography>
            <Typography gutterBottom variant="body1">{checkPoint?.description}</Typography>
            <Typography variant="h6" fontWeight={"bold"}>Отзывы</Typography>
            <List>
                {feedbacks.map((value) =>
                    <Box key={value.id} textAlign={"left"}>
                        <Typography variant="h6" fontWeight="bold">
                            Фидбек от {value.user.first_name}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            Оценка: {value.grade}
                        </Typography>
                        <Typography variant="body1">
                            Коментарий: {value.comment}
                        </Typography>
                        <Typography variant="body1">
                            Id посылки: {value.submission.id}
                        </Typography>
                        <Typography variant="caption">
                            Дата и время: {value.date_time}
                        </Typography>
                        <Typography variant="body1">
                            <LikeBtn submissionId={value.id} count={value.like} />
                            <DislikeBtn submissionId={value.id} count={value.dislike} />
                        </Typography>
                    </Box>
                )}
            </List>
            <Typography variant="h5" gutterBottom>Ссылка на гит/файл</Typography>
            <TextField id="standard-basic" label="Git" variant="outlined" value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
            <Box display="flex" flexDirection="column" gap="10px" margin="10px">
                <Tooltip title="Чтобы завершить решение, необходимо, чтобы был оставлено хотя бы два отзыва с оценкой 4 или 5">

                    <Button variant="contained" onClick={() => {
                        if (checkPoint === undefined) return;
                        ApiService.postSubmissionByCheckPointId(checkPoint?.id, "test", submissionText)
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