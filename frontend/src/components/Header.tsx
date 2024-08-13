import { FC, useContext, useEffect, useState } from 'react';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';
import { Button, Avatar, Typography, Tabs, Tab, AppBar, Toolbar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_innoprog_projects.svg';
import { UserItem } from "../models/types.ts";
import ApiService from "../services/ApiService.ts";


function Header({changeProjectsTab, disabledTabs}: {changeProjectsTab: (tab: number) => void, disabledTabs?: boolean}) {
    const { store } = useContext(Context);
    const navigator = useNavigate();
    const [profile, setProfile] = useState<UserItem | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await ApiService.getProfile();
                setProfile(profile.data);
                console.log(profile);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };

        fetchData();
    }, [store]);

    const handleLoginClick = () => {
        navigator('/login');
    };

    return (
        <AppBar position="static" color="default" sx={{ m: 0 }} style={{
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'space-between',
            // padding: '10px',
            // marginBottom: '10px',
            // marginTop: '20px',
        }}>
            <Toolbar sx={{p: '5px'}}>
                <img src={logo} alt="Logo" style={{ height: '50px' }} />
                <Box visibility={store.isAuth ? 'visible' : 'hidden'} sx={{ flexGrow: 1 }}>
                    <Tabs
                        value={activeTab}
                        aria-label="project tabs"
                        centered
                        onChange={(_, newValue) => {setActiveTab(newValue); changeProjectsTab(newValue);}}
                    >
                        <Tab label="Каталог" disabled={disabledTabs}/>
                        <Tab label="В процессе" disabled={disabledTabs}/>
                        <Tab label="Завершённые" disabled={disabledTabs}/>
                    </Tabs>
                </Box>
                {(store.isAuth && profile !== null) ? (
                    <>
                        <Typography
                            sx={{ mr: '15px' }}
                            variant='h6'
                        >
                            {profile.first_name}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Button onClick={handleLoginClick}>Авторизироваться</Button>
                    </>
                )}
                <Box sx={{ flexGrow: 0 }}>
                    <Avatar
                        alt={store.isAuth ? profile?.first_name : "Programmer"}
                        src={profile?.photo_fase}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid' }}
                    />
                </Box>
            </Toolbar>

            <div style={{ display: 'flex', alignItems: 'center' }}>

            </div>
        </AppBar>
    );
};

export default observer(Header);
