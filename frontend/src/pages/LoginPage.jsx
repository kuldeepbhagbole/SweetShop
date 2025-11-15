import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // For registration
  const { loginUser, registerUser, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      loginUser(username, password);
    } else {
      registerUser(username, password, role);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="role">Register as:</label>
            <select 
              id="role" 
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin (Requires admin password)</option>
            </select>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Login' : 'Register'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;