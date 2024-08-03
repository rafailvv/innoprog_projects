import {Card, Box, Stack, Typography, Divider, Chip, CardContent, CardHeader, CardMedia} from "@mui/material";
import {Difficulty, ProjectItem} from "../models/types";

interface Props {
    project: ProjectItem;
}


function ProjectCard({project}: Props) {

    const getWorkCountText = (count: number): string => {
        if (count === 1) {
            return 'взял в работу';
        } else if (count > 1 && count < 5) {
            return 'взяли в работу';
        } else {
            return 'взяли в работу';
        }
    };

    const {name, description, company, difficulty, users_in_progress_count} = project;

    return (
        <Card variant="outlined" sx={{width: 250, height: 350, borderRadius: 3, backgroundColor: '#EDE1FF'}}>
            <CardHeader
                title={
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            fontSize: '1.2rem',
                            lineHeight: '1.2'
                        }}
                    >
                        {name}
                    </Typography>
                }
                sx={{pb: 1}}
            />
            <Divider/>
            <CardContent sx={{pt: 0, pb: 1, overflow: 'hidden'}}>
                <Box sx={{p: 1, textTransform: 'none', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    <Typography align="left" variant="subtitle1" fontWeight="bold">
                        Описание
                    </Typography>
                    <Typography
                        align="left"
                        gutterBottom
                        mb={1}
                        variant="body2"
                        sx={{
                            fontSize: "0.8rem",
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 5,
                        }}
                    >
                        {description}
                    </Typography>

                    <Typography align="left" variant="subtitle1" fontWeight="bold">
                        От компании:
                    </Typography>

                    <Box sx={{pt: 1}}>
                        <CardMedia
                            component="img"
                            image={company.logo}
                            title={company.name}
                            alt={company.name}
                            style={{
                                height: 38,
                                objectFit: 'contain'
                            }}
                        />
                    </Box>

                </Box>
            </CardContent>
            <Divider/>
            <CardContent sx={{pt: 1, pb: 1}}>
                <Box>
                    <Stack direction="row" spacing={1} justifyContent="center">
                        {Object.keys(Difficulty).map((key) => (
                            <Chip key={key} color={difficulty === key ? "primary" : "default"} label={key}
                                  size="small"/>
                        ))}
                    </Stack>
                </Box>
            </CardContent>
            <Divider/>
            <CardContent sx={{pt: 1, pb: 1}}>
                <Typography gutterBottom variant="body2">
                    {users_in_progress_count} {getWorkCountText(users_in_progress_count)}
                </Typography>
            </CardContent>


        </Card>
    );
}

export default ProjectCard;
