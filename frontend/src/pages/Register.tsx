import { Box, Button, TextField, Typography } from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';

const Register: FC = () => {
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

    const [errors, setErrors] = useState()
    const { store } = useContext(Context);


    async function submitRegister() {
        await store.register(username, password, email, first_name, last_name, phone, github, telegram_username, telegram_id);

        if (store.badRequest) {
            setErrors(store.badRequest);
        } else {
            navigator("/login");
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
                    error={errors && 'username' in errors}
                    value={username} onChange={(e) => { setUsername(e.target.value); }} id="login"
                    label="Login*" variant="outlined"
                    helperText={(errors && 'username' in errors) ? (errors as any).username[0] : ''}
                />
                <br />
                <TextField value={password} onChange={(e) => { setPassword(e.target.value); }} id="password"
                    label="Password*" type="password" autoComplete="current-password" variant="outlined"
                    error={errors && 'password' in errors}
                    helperText={(errors && 'password' in errors) ? (errors as any).password[0] : ''}
                />
                <br />
                <TextField value={email} onChange={(e) => { setEmail(e.target.value); }} id="email"
                    label="Email" type="email" autoComplete="current-email" variant="outlined"
                    error={errors && 'email' in errors} />
                <br />
                <TextField value={first_name} onChange={(e) => { setFirst_name(e.target.value); }} id="name"
                    label="Name" variant="outlined"
                    error={errors && 'first_name' in errors} />
                <br />
                <TextField value={last_name} onChange={(e) => { setLast_name(e.target.value); }} id="surname"
                    label="Surname" variant="outlined"
                    error={errors && 'last_name' in errors} />
                <br />
                <TextField value={phone} onChange={(e) => { setPhone(e.target.value); }} id="phone"
                    label="Phone*" type="tel" variant="outlined"
                    error={errors && 'phone' in errors}
                    helperText={errors && 'phone' in errors ? (errors as any).phone[0] : ''}
                />
                <br />
                <TextField value={github} onChange={(e) => { setGithub(e.target.value); }} id="git"
                    label="Github" type="text" variant="outlined"
                    error={errors && 'github' in errors} />
                <br />
                <TextField value={telegram_username} onChange={(e) => { setTelegram_username(e.target.value); }} id="telegram"
                    label="Telegram" type="text" variant="outlined"
                    error={errors && 'telegram_username' in errors} />
                <br />
                <TextField value={telegram_id} onChange={(e) => { setTelegram_id(parseInt(e.target.value)); }} id="telegram_id"
                    label="Telegram Id" type="number" variant="outlined"
                    error={errors && 'telegram_id' in errors}
                />
                <br />
                <Typography variant="body2">Already have an account? <Button variant="text" onClick={() => navigator("/login")}>Login</Button></Typography>
                <Button variant="contained" onClick={submitRegister}>Register</Button>
            </div>
        </Box>
    )
}

export default Register