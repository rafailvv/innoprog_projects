import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';

const pointBoilerplate = [{text: 'check 1', status: 0}, {text: 'check 2', status: 1}, {text: 'check 3', status: 2}]

function Project() {
    // const checkPoints = 4;
    const [checkPoints, setCheckPoints] = useState(pointBoilerplate)
    return (
        <Box>
            <Typography variant='h4' gutterBottom>Разработка нейросети</Typography>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    
                >
                    <Typography variant='h5'>Описание</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h5'>Чек-поинты</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {checkPoints.map((value) => <ListItemButton key={value.text}>
                            <ListItemIcon>
                                <DoneIcon color={value.status > 1 ? 'warning': 'success'}></DoneIcon>
                            </ListItemIcon>
                            <ListItemText primary={value.text}/>
                        </ListItemButton>)}
                        
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h5'>Структура</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h5'>Критерии оценки</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h5'>О заказчике</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h5'>Ждут проверки</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default Project;