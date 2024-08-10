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

    const [visibleProjects, setVisibleProjects] = useState<ProjectItem[]>([]);

    const { store } = useContext(Context);

    const changeProjectsTab = (tab: number) => {
        if (tab === 0) {
            setVisibleProjects(allProjects);
        } else if (tab === 1) {
            setVisibleProjects(doneProjects);
        } else if (tab === 2) {
            setVisibleProjects(inProgressProjects);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const allProjects = await ApiService.getProjects();
            setAllProjects(allProjects.data);
            setVisibleProjects(allProjects.data);

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

    // if (!store.isAuth) {
    //     return (
    //         <>
    //             <Header changeProjectsTab={() => { }} />
    //             {allProjects.length > 0 && (
    //                 <div style={{ marginBottom: '20px' }}>
    //                     <ProjectGrid projects={allProjects} name='Доступные проекты' />
    //                 </div>
    //             )}
    //         </>
    //     );
    // }

    return (
        <>
            <Header changeProjectsTab={store.isAuth ? changeProjectsTab : () => {}} />
            {visibleProjects.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <ProjectGrid projects={visibleProjects} name='' />
                </div>
            )}
        </>
    );
};

export default observer(AllProjects);
