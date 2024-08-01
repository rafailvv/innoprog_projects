import { Box, Button, TextField, Typography } from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';
import { observer } from 'mobx-react-lite';

const Login: FC = () => {
    const navigator = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const { store } = useContext(Context);

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
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField value={username} onChange={(e) => { setLoginFailed(false); setUsername(e.target.value); }} id="login"
                    label="Login" variant="outlined"
                    error={loginFailed}
                    helperText={store.badRequest?.username ? store.badRequest.username[0] : ''}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            login()
                        }
                    }}
                />
                <br />
                <TextField value={password} onChange={(e) => { setLoginFailed(false); setPassword(e.target.value); }} id="password"
                    label="Password" type="password" autoComplete="current-password" variant="outlined"
                    error={loginFailed}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            login()
                        }
                    }}
                    helperText={store.badRequest?.password ? store.badRequest.password[0] : ''}
                />
                <br />
                <Typography variant="body2">Don't have an account? <Button variant="text" onClick={() => navigator("/register")}>Register</Button></Typography>

                <Button variant="contained" onClick={login}>Submit</Button>
            </div>
        </Box>
    )
}

export default observer(Login);