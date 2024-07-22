import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionDetails, AccordionSummary, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { CheckPointItem, ProjectItem } from '../services/types';
import { getCheckPointsByProjectId, getProjectById } from '../services/api';
import { useNavigate } from 'react-router-dom';

// const pointBoilerplate = [{ text: 'check 1', status: 0 }, { text: 'check 2', status: 1 }, { text: 'check 3', status: 2 }]

function Project() {
    // const checkPoints = 4;
    const [checkPoints, setCheckPoints] = useState<CheckPointItem[]>()
    const [project, setProject] = useState<ProjectItem>();
    const navigator = useNavigate();

    useEffect(() => {
        const projectId = window.location.pathname.split("/").pop();
        if (!projectId) return;
        getProjectById(parseInt(projectId)).then(response => response.json()).then(data => {
            setProject(data);
            // console.log(data);
        })
        getCheckPointsByProjectId(parseInt(projectId)).then(response => response.json()).then(data => {
            setCheckPoints(data);
            console.log(data);
        })
    }, [])

    function routeChange(id: number, index: number) {
        return () => {
            navigator('' + id, {
                state: {
                    id: index
                }
            });
        }
    }

    return (
        <Box>
            <Typography variant='h4' gutterBottom>{project?.name}</Typography>
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
                        {project?.description}
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
                        {checkPoints?.map((value, i) => <ListItemButton key={value.id} onClick={routeChange(value.id, i)}>
                            <ListItemIcon>
                                <DoneIcon color={value.id > 1 ? 'warning' : 'success'}></DoneIcon>
                            </ListItemIcon>
                            <ListItemText primary={value.name} />
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
                        {project?.code_structure}
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
                        {project?.assessment_criteria}
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