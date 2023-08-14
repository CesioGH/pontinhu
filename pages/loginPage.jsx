import React, { useState, useEffect } from 'react'; 
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { auth } from '../src/lib/firebase';
import Link from 'next/link';
import { UserAuthContext } from '../src/contexts/UserAuthContext';

auth.languageCode = 'pt-BR';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const h2Element = document.querySelector('h2');
    const h2Color = h2Element ? window.getComputedStyle(h2Element).color : null;
    const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    if (h2Color === 'rgba(0, 0, 0, 0.87)' && bodyBackgroundColor === 'rgb(51, 51, 51)') {
      location.reload();
    } else if (h2Color === 'rgb(255, 255, 255)' && bodyBackgroundColor === 'rgb(245, 245, 245)') {
      location.reload();
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); 
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não correspondem. Por favor, confirme sua senha.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/'); 
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div >
      <Link href="/">
        <Button style={{borderWidth:"2px", borderStyle:"solid", margin:"5px"}}>
          Voltar
        </Button>
      </Link>

      <Container style={{display:"flex",alignItems:"center" ,borderStyle:"solid", borderRadius:"10px", padding:"10px",flexDirection:"column", marginTop:"10vh" ,justifyContent:"center"}} component="main" maxWidth="xs">
        <Typography component="h2" variant="h5">Faça login com GOOGLE </Typography>
        
        <Button 
          style={{ 
            borderStyle: "solid", 
            borderWidth: "3px", 
            fontSize: "24px", // aumenta o tamanho da fonte
            padding: "15px 30px" // ajusta o preenchimento do botão
          }} 
          onClick={handleGoogleLogin}
        >
          Login com 
          
          <span style={{color: "white"}}>.</span> {/*  */}
          <span style={{color: "#4285F4"}}>G</span> {/* azul */}
          <span style={{color: "#DB4437"}}>o</span> {/* vermelho */}
          <span style={{color: "#F4B400"}}>o</span> {/* amarelo */}
          <span style={{color: "#4285F4"}}>g</span> {/* azul */}
          <span style={{color: "#0F9D58"}}>l</span> {/* verde */}
          <span style={{color: "#DB4437"}}>e</span> {/* vermelho */}
        </Button>

<br />



        <Typography>
          caso esteja usando um navegador que não suporta login com Google, use os botões abaixo
        </Typography>

        <Typography component="h2" color='primary' variant="h5" onClick={() => setFormType('login')}>
          ACESSE
        </Typography>

        <Typography component="h2" variant="h5" color="secondary" onClick={() => setFormType('register')}>
          REGISTRE-SE
        </Typography>

        {formType === 'login' && (
          <>
            <TextField variant="outlined" margin="normal" fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" value={email} onChange={handleEmailChange} />
            <TextField variant="outlined" margin="normal" fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={handlePasswordChange} />
            <Button fullWidth variant="contained" color="primary" onClick={handleLogin} disabled={loading} style={{margin:"5px 5px 5px 0"}}>Entrar</Button>
          </>
        )}

        {formType === 'register' && (
          <>
            <TextField variant="outlined" margin="normal" fullWidth id="email" label="Endereço de Email" name="email" autoComplete="email" value={email} onChange={handleEmailChange} />
            <TextField variant="outlined" margin="normal" fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={handlePasswordChange} />
            <TextField variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirme a Senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button fullWidth variant="contained" color="secondary" onClick={handleSignup} disabled={loading} style={{margin:"5px 5px 5px 0"}}>Registrar</Button>
          </>
        )}

        <Typography variant="body2">
          <Link href="/PasswordReset">
            <Button>
              Esqueci minha senha
            </Button>
          </Link>
        </Typography>
      </Container>
    </div>
  );
}

export default LoginPage;
