import { auth } from '../src/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Container, Typography, Grid } from '@mui/material';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Para mostrar mensagens de erro

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Para prevenir o comportamento padrão do formulário

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Redirecionar para a página de resumos após login bem-sucedido
      router.push('/resumos');
    } catch (error) {
      // Lidar com qualquer erro que possa ocorrer durante o login
      setError(error.message);
    }
  };

  return (
    <div>
       <Link href="/">
      <Button style={{borderWidth:"2px", borderStyle:"solid", margin:"5px"}}>
      Voltar
      </Button>
     </Link>
     <h3 style={{color: "#D4AF37"}}>Esse login é destinado ao administrador da página:</h3>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <br />
       
        
      </form>
      {error && <p>{error}</p>} {/* Mostrar a mensagem de erro se houver algum */}
    </div>
  );
};

export default Login;
