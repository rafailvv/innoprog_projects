import { FC, useContext, useEffect, useState } from 'react';
import ProjectRow from '../components/ProjectRow';
import ProjectGrid from '../components/ProjectGrid';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import ApiService from '../services/ApiService';
import { ProjectItem } from '../models/types';
import gearGif from '../assets/gear.gif';
import Header from '../components/Header';

const AllProjects: FC = () => {
    const [hotProjects, setHotProjects] = useState<ProjectItem[]>([]);
    const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
    const [doneProjects, setDoneProjects] = useState<ProjectItem[]>([]);
    const [inProgressProjects, setInProgressProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { store } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            const allProjects = await ApiService.getProjects();
            setAllProjects(allProjects.data);

            try {
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

    if (!store.isAuth) {
        return (
            <>
                <Header />
                {allProjects.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <ProjectGrid projects={allProjects} name='Доступные проекты' />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <Header />

            {hotProjects.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <ProjectRow projects={hotProjects} name='Рекомендуемые проекты' />
                </div>
            )}
            {doneProjects.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <ProjectRow projects={doneProjects} name='Завершенные проекты' />
                </div>
            )}
            {inProgressProjects.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <ProjectRow projects={inProgressProjects} name='Проекты в процессе' />
                </div>
            )}
        </>
    );
};

export default observer(AllProjects);
