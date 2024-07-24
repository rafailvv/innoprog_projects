import { FC, useContext, useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import ApiService from '../services/ApiService';
import { ProjectItem } from '../models/types';

const AllProjects: FC = () => {
    const [hotProjects, setHotProjects] = useState<ProjectItem[]>([]);
    const [doneProjects, setDoneProjects] = useState<ProjectItem[]>([]);
    const [inProgressProjects, setInProgressProjects] = useState<ProjectItem[]>([]);

    const { store } = useContext(Context);

    useEffect(() => {
        store.getProjects()
        ApiService.getHotProjects().then(response => setHotProjects(response.data))
        ApiService.getDoneProjects().then(response => setDoneProjects(response.data))
        ApiService.getInProgressProjects().then(response => setInProgressProjects(response.data))
    }, [])
    return (
        <>
            <ProjectRow projects={hotProjects} name='Hot Projects' />
            <ProjectRow projects={doneProjects} name='Done Projects'/>
            <ProjectRow projects={inProgressProjects} name='In Process'/>
        </>
    )
}

export default observer(AllProjects);