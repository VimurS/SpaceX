import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    TextInput,
    Paper,
    Title,
    Center,
    Stack,
    Container
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/resources');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = () => {
        if (username === 'admin' && password === 'password') {
            login('dummy-token');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e003f 0%, #3a0ca3 50%, #4361ee 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Container size="xs">
                <Paper
                    withBorder
                    shadow="xl"
                    radius="md"
                    p="xl"
                    sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                    }}
                >
                    <Stack spacing="md">
                        <Title order={2} ta="center" c="white">
                            🚀 Login to SpaceX Dashboard
                        </Title>

                        <TextInput
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.currentTarget.value)}
                            mt="md"
                            styles={{
                                label: { color: 'white' },
                                input: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }
                            }}
                        />

                        <TextInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            mt="md"
                            styles={{
                                label: { color: 'white' },
                                input: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }
                            }}
                        />

                        <Button
                            onClick={handleSubmit}
                            mt="xl"
                            fullWidth
                            size="md"
                            color="violet"
                        >
                            Login
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </div>
    );
}

