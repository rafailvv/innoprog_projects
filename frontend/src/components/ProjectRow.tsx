import { Typography, Grid, Button } from "@mui/material";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";

function ProjectRow({ projects, name }) {
    const navigator = useNavigate();
    function routeChange(id: number) {
        const inner_id = id
        return () => {
            console.log(inner_id)
            navigator("/projects/"+inner_id);
        }
    }

    return (
        <>
            <Typography variant='h4' gutterBottom>{name}</Typography>
            <Grid container spacing={2} sx={{ margin: "2px" }}>
                {projects.map((value) => {
                    return <Button onClick={routeChange(value.id)} variant='text' key={value.name}>
                        <Grid item>
                            <ProjectCard project={value} ></ProjectCard>
                        </Grid>
                    </Button>
                })}
            </Grid>
        </>
    );
}

export default ProjectRow;