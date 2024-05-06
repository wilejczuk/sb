import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../App.css';
import './Login.css';
import APIService from './../../api_connector';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); 
  const navigate = useNavigate();

  const connector = new APIService();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);

    connector.getAuthentication(username, password)
    .then((body) => {
      if (body.userId) {
        localStorage.setItem('userToken', body.token);
        navigate('/admin', { state: { userId: body.userId, userName: body.userName } })
      } else {
        setError(true); 
      }
    })
    .catch(() => {
      setError(true); 
    });
  };

  return (
    <div className="login-form">
      <div className="app-name">Планировщик системных обновлений</div> 
      <h2>Добро пожаловать!</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error-message">Авторизация не пройдена</div>}
      </form>
    </div>
  );
};

export default Login;