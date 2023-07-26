import { AuthProvider } from '../src/contexts/AuthContext'
import {UserAuthProvider} from '../src/contexts/UserAuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <UserAuthProvider>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </UserAuthProvider>
  );
}

export default MyApp;
