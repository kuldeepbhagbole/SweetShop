import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/sweetApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // <-- YEH ADD KAREIN
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (e) {
        console.error('Invalid token');
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // <-- YEH ADD KAREIN
  }, [token]);

  const loginUser = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { username, password });
      
      // Pehle token set karein
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      
      // Fir user set karein
      const decodedUser = jwtDecode(response.data.token);
      setUser(decodedUser);
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const registerUser = async (username, password, role) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', { username, password, role });

      // Pehle token set karein
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      
      // Fir user set karein
      const decodedUser = jwtDecode(response.data.token);
      setUser(decodedUser);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const authData = {
    user,
    token,
    error,
    loading, // <-- YEH ADD KAREIN
    loginUser,
    registerUser,
    logoutUser,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthContext;