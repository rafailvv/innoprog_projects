import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CheckPointItem, ProjectItem, SubmissionItem } from "../models/types";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import Header from "../components/Header";
import PaperElement from "../components/PaperElement";
import PaperSubmission from "../components/PaperSubmission";
import SubmissionDialog from "../components/SubmissionDialog";


function CheckPoint() {
    const [project, setProject] = useState<ProjectItem>();
    const [checkPoint, setCheckPoint] = useState<CheckPointItem>();
    const [userSubmissions, setUserSubmissions] = useState<SubmissionItem[]>();
    const [otherSubmissions, setOtherSubmissions] = useState<SubmissionItem[]>();
    const innerCheckpointId = useLocation().state.id;

    const [submissionDialogOpen, setSubmissionDialogOpen] = useState<boolean>(false);

    const [solutionsToggle, setSolutionsToggle] = useState<number>(0);
    const navigator = useNavigate();

    const closeSubmissionDialog = () => {
        setSubmissionDialogOpen(false)
        if (!checkPoint) return;
        ApiService.getSubmissionsByCheckPointId(checkPoint.id)
            .then(response => {
                console.log(response.data)
                setUserSubmissions(response.data.user_submissions)
                setOtherSubmissions(response.data.other_submissions.filter(sub => sub.accepted && sub.is_visible || sub.user.teacher))
            })
            .catch(err => console.error(err));
    }
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
    }, []);

    return (
        <Box>
            <Header changeProjectsTab={() => { }}/>

            <Container>
                <Button onClick={() => { navigator(-1); }}> Проект {project?.name}</Button>
                <Typography variant="h4" fontWeight="bold" gutterBottom>{checkPoint?.name.toUpperCase()}</Typography>

                <PaperElement title="Описание" description={checkPoint?.description} />


                <Box display={'flex'} m={2}>
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
                {solutionsToggle == 0 ?

                    <Box>
                        <Stack sx={{ mb: 1 }}>
                            {userSubmissions?.map((value) =>
                                <PaperSubmission key={value.id} value={value}
                                    onChange={(value: SubmissionItem) => {
                                        setUserSubmissions(userSubmissions?.map(sub => sub.id == value.id ? value : sub))
                                    }}
                                />
                            )}
                        </Stack>
                        <SubmissionDialog
                            open={submissionDialogOpen}
                            onClose={closeSubmissionDialog}
                            submissionId={checkPoint?.id}
                        />
                        <Button sx={{ width: '100%' }}
                            variant="contained"
                            onClick={() => { setSubmissionDialogOpen(true) }}
                            disabled={userSubmissions?.filter(submission => submission.is_visible).length !== 0}
                        >
                            Добавить решение
                        </Button>
                    </Box>

                    :
                    <Stack sx={{ mb: 1 }}>
                        {otherSubmissions?.map((value) =>
                            <PaperSubmission key={value.id} value={value} externalSubmission
                                onChange={(value: SubmissionItem) => {
                                    setOtherSubmissions(otherSubmissions?.map(sub => sub.id == value.id ? value : sub))
                                }}
                            />
                        )}
                    </Stack>
                }
            </Container>
        </Box>
    );
}

export default CheckPoint;