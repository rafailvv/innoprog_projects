import {Typography, Grid, Button} from "@mui/material";
import ProjectCard from "./ProjectCard";
import {useNavigate} from "react-router-dom";
import {ProjectItem} from "../models/types";
import {observer} from "mobx-react-lite";

interface Props {
    projects: ProjectItem[],
    name: string
}

function ProjectGrid({projects, name}: Props) {
    const navigator = useNavigate();

    function routeChange(id: number) {
        return () => {
            navigator("/projects/" + id);
        }
    }

    return (
        <>
            <Typography variant='h4' gutterBottom>{name}</Typography>
            <Grid
                container
                spacing={2}
                sx={{justifyContent: 'center'}}
            >
                {projects.map((value) => (
                    <Grid item xs='auto' key={value.id}>
                        <Button
                            onClick={() => routeChange(value.id)}
                            variant='text'
                            sx={{
                                minWidth: 'auto',
                                padding: 0
                            }}
                        >
                            <ProjectCard project={value}/>
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </>
    );

}

export default observer(ProjectGrid);
