import { AuthContext } from '@app/contexts/AuthContext';
import { useContext, useState } from 'react';

export default function Home() {
  const { user, login } = useContext(AuthContext) as any;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ padding: 24 }}>
      <h1>HR Portal (Web)</h1>
      {!user ? (
        <div style={{ maxWidth: 420 }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => login(email, password)}>Login</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.fullName}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
}
