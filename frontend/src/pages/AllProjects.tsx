import { FC, useContext, useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import ApiService from '../services/ApiService';
import { ProjectItem } from '../models/types';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import gearGif from '../assets/gear.gif';

const AllProjects: FC = () => {
    const [hotProjects, setHotProjects] = useState<ProjectItem[]>([]);
    const [doneProjects, setDoneProjects] = useState<ProjectItem[]>([]);
    const [inProgressProjects, setInProgressProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigator = useNavigate();

    const { store } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await store.getProjects();
                const [hot, done, inProgress] = await Promise.all([
                    ApiService.getHotProjects(),
                    ApiService.getDoneProjects(),
                    ApiService.getInProgressProjects()
                ]);

                setHotProjects(hot.data);
                setDoneProjects(done.data);
                setInProgressProjects(inProgress.data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [store]);

    if (loading) {
        return (
            <div id="loading" className="loading-overlay">
                <img src={gearGif} alt="Loading" />
            </div>
        );
    }

    return (
        <>
            <Button onClick={async () => {
                await store.logout();
                navigator('/login');
            }}>Выход</Button>

            {hotProjects.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <ProjectRow projects={hotProjects} name='Рекомендуемые проекты'/>
                </div>
            )}
            {doneProjects.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <ProjectRow projects={doneProjects} name='Завершенные проекты'/>
                </div>
            )}
            {inProgressProjects.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <ProjectRow projects={inProgressProjects} name='Проекты в процессе'/>
                </div>
            )}
        </>
    );
};

export default observer(AllProjects);
