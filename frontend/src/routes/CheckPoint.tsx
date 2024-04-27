import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";

function CheckPoint(props) {
    // const {name, }
    const points = 15;
    const feedback = [{ student: 1, description: 'boilerplate' }, { student: 2, description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam modi earum pariatur aliquam! Voluptatem esse hic perspiciatis illum pariatur laborum minus animi eligendi sunt. Libero culpa enim accusamus voluptas sint.' }]
    return (
        <>
            <Typography variant="h4" gutterBottom>Разработка нейросети</Typography>
            <Typography variant="h5" gutterBottom>Check point 3</Typography>
            <Typography>Очков {points}</Typography>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, odio repellendus. Neque in aspernatur possimus sequi repellat, ratione natus corrupti perspiciatis, sunt laborum magni. Maxime perferendis nihil nulla corporis mollitia.</Typography>
            <List>
                {feedback.map((value) =>
                    <ListItem key={value.student}>
                        <ListItemText primary={value.student} secondary={value.description} />
                    </ListItem>
                )}
            </List>
            <Typography variant="h5" gutterBottom>Ссылка на гит/файл</Typography>
            <TextField id="standard-basic" label="Git" variant="standard" />
            <Box display="flex" flexDirection="column" gap="10px" margin="10px">
                <Button variant="contained">Проверить</Button>
                <Button variant="contained" disabled>
                    Пройдено
                </Button>
            </Box>
        </>
    );
}

export default CheckPoint;