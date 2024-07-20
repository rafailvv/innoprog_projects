import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegistration } from '../services/Api.ts';

function Register() {
    const navigator = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phone, setPhone] = useState("");
    const [github, setGithub] = useState("");
    const [telegram_username, setTelegram_username] = useState("");
    const [telegram_id, setTelegram_id] = useState(0);
    const [registrationFailed, setRegistrationFailed] = useState(false);


    async function submitRegister() {
        let status = 0;
        await postRegistration(username, password, email, first_name, last_name, phone, github, telegram_username, telegram_id)
            .then(response => {status = response.status; console.log(response); return response.json()})
            .then(data => console.log(data));
        
        if(Math.floor(status/100) === 2){
            navigator("/projects");
        } else {
            setRegistrationFailed(true);
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
                <TextField
                    error={registrationFailed}
                    value={username} onChange={(e) => { setUsername(e.target.value); }} id="login"
                    label="Login*" variant="outlined" />
                <br />
                <TextField value={password} onChange={(e) => { setPassword(e.target.value); }} id="password"
                    label="Password*" type="password" autoComplete="current-password" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={email} onChange={(e) => { setEmail(e.target.value); }} id="email"
                    label="Email*" type="email" autoComplete="current-email" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={first_name} onChange={(e) => { setFirst_name(e.target.value); }} id="name"
                    label="Name*" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={last_name} onChange={(e) => { setLast_name(e.target.value); }} id="surname"
                    label="Surname*" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={phone} onChange={(e) => { setPhone(e.target.value); }} id="phone"
                    label="Phone*" type="tel" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={github} onChange={(e) => { setGithub(e.target.value); }} id="git"
                    label="Git*" type="text" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={telegram_username} onChange={(e) => { setTelegram_username(e.target.value); }} id="telegram"
                    label="Telegram*" type="text" variant="outlined"
                    error={registrationFailed}/>
                <br />
                <TextField value={telegram_id} onChange={(e) => { setTelegram_id(parseInt(e.target.value)); }} id="telegram_id"
                    label="Telegram Id" type="number" variant="outlined"
                    />
                <br />
                <Typography variant="body2">Already have an account? <Button variant="text" onClick={() => navigator("/login")}>Login</Button></Typography>
                <Button variant="contained" onClick={submitRegister}>Register</Button>
            </div>
        </Box>
    )
}

export default Register