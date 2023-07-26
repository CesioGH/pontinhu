import { useState } from 'react';
import { auth } from '../src/lib/firebase';
import { useRouter } from 'next/router';

const SignupComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await auth.createUserWithEmailAndPassword(email, password);
      // Redirecionar para a página de cadastro de resumos após o cadastro
      router.push('/resumos');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Cadastrar</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default SignupComponent;
