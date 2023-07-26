import { auth } from '../src/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
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
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <br />
        <p>resumospontinho@proton.me</p>
        <br />
        <p>nakamura1616</p>
        
      </form>
      {error && <p>{error}</p>} {/* Mostrar a mensagem de erro se houver algum */}
    </div>
  );
};

export default LoginPage;
