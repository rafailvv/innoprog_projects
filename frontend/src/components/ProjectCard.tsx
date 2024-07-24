import { Card, Box, Stack, Typography, Divider, Chip } from "@mui/material";
import { ProjectItem } from "../models/types";

interface Props {
    project: ProjectItem
}

function ProjectCard({ project }: Props) {
    console.log(project)
    const { id, name, description, price, file, code_structure, assessment_criteria, company } = project;
    console.log(company)
    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>

                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    {description}
                </Typography>
                <Typography gutterBottom variant="body2">
                    Компания: {company?.name}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                {/* <Typography gutterBottom variant="body2">
                    {studentsWork} взяли в работу
                </Typography> */}
                
                <Stack direction="row" spacing={1}>
                    <Chip color="primary" label="Soft" size="small" />
                    <Chip label="Medium" size="small" />
                    <Chip label="Hard" size="small" />
                </Stack>
            </Box>
        </Card>
    )
}

export default ProjectCard;