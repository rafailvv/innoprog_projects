import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../services/api';
import { Cookies, useCookies } from 'react-cookie';

export default function Login() {
    const navigator = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])


    async function submitLogin() {
        let status = 0;
        await postLogin(username, password)
            .then(response => {
                console.log(response.headers.get('set-cookie'))
                setCookie('access_token', response.headers.get('set-cookie'))
                status = response.status;
                return response.json()
            })
            .then(data => {
                console.log(data);
            });

        if (Math.floor(status / 100) === 2) {
            navigator("/projects");
        } else {
            setLoginFailed(true);
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
                    label="Login" variant="outlined" error={loginFailed} />
                <br />
                <TextField value={password} onChange={(e) => { setLoginFailed(false); setPassword(e.target.value); }} id="password"
                    label="Password" type="password" autoComplete="current-password" variant="outlined"
                    error={loginFailed} />
                <br />
                <Typography variant="body2">Don't have an account? <Button variant="text" onClick={() => navigator("/register")}>Register</Button></Typography>

                <Button variant="contained" onClick={submitLogin}>Submit</Button>
            </div>
        </Box>
    )
}
