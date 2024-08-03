import {Box, Button, TextField, Typography, Link} from '@mui/material';
import {FC, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Context} from '../main';
import {observer} from 'mobx-react-lite';

const Login: FC = () => {
    const navigator = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const {store} = useContext(Context);

    const login = async () => {
        await store.login(username, password);
        console.log(store.isAuth);
        if (!store.isAuth) {
            setLoginFailed(true);
        } else {
            navigator('/projects');
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <img src="src/assets/logo_innoprog_projects.svg" alt="Logo"
                 style={{marginTop: '50px', marginBottom: '20px', width: '35ch', position: 'absolute', top: '20px'}}/>

            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    marginTop: '50px',
                }}
                noValidate
                autoComplete="off"
            >
                <Typography variant="h3" sx={{marginBottom: '20px', fontWeight: 'bold'}}>Авторизация</Typography>
                <TextField
                    value={username}
                    onChange={(e) => {
                        setLoginFailed(false);
                        setUsername(e.target.value);
                    }}
                    id="login"
                    label="Логин"
                    variant="outlined"
                    error={loginFailed}
                    helperText={store.badRequest?.username ? store.badRequest.username[0] : ''}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            login();
                        }
                    }}
                    sx={{marginBottom: '10px', width: '40ch'}}
                />
                <TextField
                    value={password}
                    onChange={(e) => {
                        setLoginFailed(false);
                        setPassword(e.target.value);
                    }}
                    id="password"
                    label="Пароль"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    error={loginFailed}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            login();
                        }
                    }}
                    helperText={store.badRequest?.password ? store.badRequest.password[0] : ''}
                    sx={{marginBottom: '20px', width: '40ch'}}
                />
                <Typography variant="body2" sx={{marginBottom: '10px'}}>
                    Нет акаунта?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigator("/register")}
                        sx={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Зарегистрируйтесь
                    </Link>
                </Typography>
                <Button
                    variant="contained"
                    onClick={login}
                    sx={{
                        width: '40ch',
                        backgroundColor: '#9C78FF',
                        fontWeight: 'bold',
                        border: '2px solid #9C78FF',
                        '&:hover': {
                            backgroundColor: 'white',
                            borderColor: '#9C78FF',
                            color: '#9C78FF',
                            border: '2px solid #9C78FF',
                        },
                    }}
                >
                    Войти
                </Button>
            </Box>
        </Box>
    );
}

export default observer(Login);
