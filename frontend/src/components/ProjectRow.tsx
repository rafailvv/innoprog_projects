import { Typography, Grid, Button, Box } from "@mui/material";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";
import { ProjectItem } from "../models/types";
import { observer } from "mobx-react-lite";

interface Props {
    projects: ProjectItem[],
    name: string
}

function ProjectRow({ projects, name }: Props) {
    const navigator = useNavigate();

    function routeChange(id: number) {
        return () => {
            navigator("/projects/" + id);
        }
    }

    return (
        <>
            <Typography variant='h4' gutterBottom>{name}</Typography>
            <Box sx={{ overflowX: 'auto', paddingBottom: '15px' }}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        display: 'inline-flex',
                        flexWrap: 'nowrap'
                    }}
                >
                    {projects.map((value) => (
                        <Grid item key={value.id}>
                            <Button
                                onClick={routeChange(value.id)}
                                variant='text'
                                sx={{
                                    minWidth: 'auto',
                                    padding: 0
                                }}
                            >
                                <ProjectCard project={value} />
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}

export default observer(ProjectRow);
