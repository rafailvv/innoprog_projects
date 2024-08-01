import { Card, Box, Stack, Typography, Divider, Chip, CardContent, CardHeader, CardMedia } from "@mui/material";
import { Difficulty, ProjectItem } from "../models/types";

interface Props {
    project: ProjectItem
}

function ProjectCard({ project }: Props) {
    // console.log(project)
    const { name, description, company, difficulty } = project;
    // console.log(company)
    // console.log(difficulty)
    return (
        <Card variant="outlined" sx={{ width: 250, minHeight: 320, borderRadius: 4 }}>
            <CardHeader title={name} />
            <Divider />
            <CardContent>
                <Box sx={{ p: 1 }}>
                    <Typography align="left" variant="h6" fontWeight="bold">
                        Описание:
                    </Typography>
                    <Typography align="left" gutterBottom mb={2} variant="body1">
                        {description}
                    </Typography>
                    <Typography align="left" variant="h6" fontWeight="bold">
                        От компании:
                    </Typography>
                </Box>
                <CardMedia sx={{ objectFit: "contain" }} component="img" height="64" image={company.logo} title={company.name} alt={company.name} />
            </CardContent>
            <Divider />
            <CardContent>
                <Box>
                    {/* <Typography gutterBottom variant="body2">
                    {studentsWork} взяли в работу
                </Typography> */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                        {Object.keys(Difficulty).map((key) => {
                            return <Chip key={key} color={difficulty == key ? "primary" : "default"} label={key} size="small" />
                        })}
                    </Stack>
                </Box>
            </CardContent>

        </Card>
    )
}

export default ProjectCard;