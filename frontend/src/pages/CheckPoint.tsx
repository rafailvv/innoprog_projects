import { Badge, Box, Button, Chip, Container, List, Paper, Stack, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckPointItem, FeedbackItem, ProjectItem, SubmissionItem } from "../models/types";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import Feedback from "../components/Feedback";
import Submission from "../components/Submission";
import Header from "../components/Header";
import { Circle } from "@mui/icons-material";
import PaperElement from "../components/PaperElement";
import PaperSubmission from "../components/PaperSubmission";
import SubmissionDialog from "../components/SubmissionDialog";

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

    const [submissionDialogOpen, setSubmissionDialogOpen] = useState<boolean>(false);

    const [likes, setLikes] = useState<Like[]>([]);

    const [solutionsToggle, setSolutionsToggle] = useState<number>(0);


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
        <Box>
            <Header changeProjectsTab={() => { }} />

            <Container>
                <Button onClick={() => { navigator(-1); }}> Проект {project?.name}</Button>
                {/* <Typography variant="h4" gutterBottom>{project?.name}</Typography> */}
                <Typography variant="h4" fontWeight="bold" gutterBottom>{checkPoint?.name.toUpperCase()}</Typography>

                <PaperElement title="Описание" description={checkPoint?.description} />


                <Box display={'flex'} m={2} >
                    <Button
                        sx={{ flex: 1, mr: 2 }}
                        variant={solutionsToggle == 0 ? 'outlined' : 'contained'}
                        onClick={() => setSolutionsToggle(0)}
                    >
                        мои решения
                    </Button>
                    <Button
                        sx={{ flex: 1, ml: 2 }}
                        variant={solutionsToggle == 1 ? 'outlined' : 'contained'}
                        onClick={() => { setSolutionsToggle(1) }}
                    >
                        чужие решения
                    </Button>
                </Box>
                <Stack sx={{ mb: 2 }}>
                    {userSubmissions?.map((value) =>
                        <PaperSubmission key={value.id} value={value} />
                    )}
                </Stack>

                <SubmissionDialog open={submissionDialogOpen} onClose={() => setSubmissionDialogOpen(false)} submissionId={checkPoint?.id}/>
                <Button sx={{ width: '100%' }}
                    variant="contained"
                    onClick={() => {setSubmissionDialogOpen(true)}}
                >
                    Добавить решение
                </Button>


                <Typography gutterBottom variant="body1">Очков: {checkPoint?.points}</Typography>
                <Typography variant="h6" fontWeight={"bold"}>Описание</Typography>
                <Typography gutterBottom variant="body1">{checkPoint?.description}</Typography>
                <Typography variant="h6" fontWeight={"bold"}>Отзывы</Typography>
                <List>
                    {feedbacks.map((value) =>
                        <Feedback key={value.id} feedback={value} />
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
                            ApiService.postSubmissionByCheckPointId(checkPoint?.id, submissionText, "test", "test")
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
            </Container>
        </Box>
    );
}

export default CheckPoint;