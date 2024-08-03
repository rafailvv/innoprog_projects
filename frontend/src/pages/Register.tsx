import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../main';

interface FormErrors {
    username?: string[];
    password?: string[];
    email?: string[];
    firstName?: string[];
    lastName?: string[];
    phone?: string[];
    github?: string[];
    telegramUsername?: string[];
    telegramId?: string[];
}

const Register: FC = () => {
    const navigator = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [github, setGithub] = useState("");
    const [telegramUsername, setTelegramUsername] = useState("");
    const [telegramId, setTelegramId] = useState<number>(0);

    const [errors, setErrors] = useState<FormErrors>({});
    const { store } = useContext(Context);

    const submitRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        await store.register(username, password, email, firstName, lastName, phone, github, telegramUsername, telegramId);

        if (store.badRequest) {
            setErrors(store.badRequest);
        } else {
            navigator("/login");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={submitRegister}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
                maxWidth: '400px',
                margin: 'auto',
                textAlign: 'center'
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>Регистрация</Typography>
            <TextField
                error={!!errors.username}
                value={username} onChange={(e) => setUsername(e.target.value)} id="username"
                label="Логин*" variant="outlined"
                helperText={errors.username ? errors.username[0] : ''}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                error={!!errors.password}
                value={password} onChange={(e) => setPassword(e.target.value)} id="password"
                label="Пароль*" type="password" autoComplete="current-password" variant="outlined"
                helperText={errors.password ? errors.password[0] : ''}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={email} onChange={(e) => setEmail(e.target.value)} id="email"
                label="Email" type="email" autoComplete="current-email" variant="outlined"
                error={!!errors.email}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName"
                label="Имя" variant="outlined"
                error={!!errors.firstName}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName"
                label="Фамилия" variant="outlined"
                error={!!errors.lastName}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={phone} onChange={(e) => setPhone(e.target.value)} id="phone"
                label="Телефон*" type="tel" variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone ? errors.phone[0] : ''}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={github} onChange={(e) => setGithub(e.target.value)} id="github"
                label="Ссылка на Github" type="text" variant="outlined"
                error={!!errors.github}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={telegramUsername} onChange={(e) => setTelegramUsername(e.target.value)} id="telegramUsername"
                label="Никнейм в Telegram" type="text" variant="outlined"
                error={!!errors.telegramUsername}
                sx={{ marginBottom: '10px', width: '100%' }}
            />
            <TextField
                value={telegramId} onChange={(e) => setTelegramId(Number(e.target.value))} id="telegramId"
                label="Telegram ID" type="number" variant="outlined"
                error={!!errors.telegramId}
                sx={{ marginBottom: '20px', width: '100%' }}
            />
            <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                Уже есть аккаунт?{' '}
                <Link variant="body2" sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }} onClick={() => navigator("/login")}>
                    Войти
                </Link>
            </Typography>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    width: '100%',
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
                Зарегистрироваться
            </Button>
        </Box>
    );
}

export default Register;
