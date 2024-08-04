import {FC, useContext, useEffect, useState} from 'react';
import {Context} from '../main';
import {observer} from 'mobx-react-lite';
import {Button, Avatar, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import logo from '../assets/logo_innoprog_projects.svg';
import {UserItem} from "../models/types.ts";
import ApiService from "../services/ApiService.ts";

const Header: FC = () => {
    const {store} = useContext(Context);
    const navigator = useNavigate();
    const [profile, setProfile] = useState<UserItem | null>(null);

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
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px',
            marginBottom: '10px',
            marginTop: '20px',
        }}>
            <img src={logo} alt="Logo" style={{height: '50px'}}/>
            <div style={{display: 'flex', alignItems: 'center'}}>
                {(store.isAuth && profile !== null) ? (
                    <>
                        <Typography
                            style={{
                                marginRight: '15px',
                                display: 'inline-block'
                            }}
                            variant='h5'
                            gutterBottom
                        >
                            {profile.first_name}
                        </Typography>
                        <Avatar
                            alt={profile.first_name}
                            src={profile.photo_fase}
                            style={{width: '60px', height: '60px', borderRadius: '50%', border: '1px solid'}}
                        />
                    </>
                ) : (
                    <>
                        <Button onClick={handleLoginClick}>Авторизироваться</Button>
                        <Avatar
                            alt="Programmer"
                            style={{width: '60px', height: '60px', borderRadius: '50%', border: '1px solid'}}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default observer(Header);
