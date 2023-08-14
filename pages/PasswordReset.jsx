import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/lib/firebase';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Verifique seu e-mail para instruções de redefinição de senha.');
        } catch (err) {
            setError('Erro ao enviar e-mail de redefinição de senha.');
            console.error(err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8
            }}>
                <Typography variant="h5">
                    Redefinir senha
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Enviar link de redefinição
                    </Button>
                    {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </Box>
                <Link href={'/'}>
                    <Button style={{borderStyle:"solid",marginTop:"10px" ,borderWidth:"2px"}}>  
                        Voltar para página inicial
                    </Button>

                </Link>
            </Box>
        </Container>
    );
};

export default PasswordReset;
