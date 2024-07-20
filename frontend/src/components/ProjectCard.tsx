import { Card, Box, Stack, Typography, Divider, Chip } from "@mui/material";

function ProjectCard({ project }) {
    const { name, description, studentsWork } = project;

    return (
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
            <Box sx={{ p: 2 }}>

                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    {description}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography gutterBottom variant="body2">
                    {studentsWork} взяли в работу
                </Typography>
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