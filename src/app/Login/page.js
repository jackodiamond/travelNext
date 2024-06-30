'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { loginUser } from './loginServerAction';
import './login.css';
import UserContext from '../components/UserContext';
import { useRouter } from 'next/navigation';
import GoogleLoginComponent from './GoogleLoginComponent';
import { connectToWebSocket, setSocketUser } from '../components/WebSocketComponent';

const Login = () => {
  const { setUsername, login } = useContext(UserContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handle submit!");
    try {
      const data = await loginUser(formData);
      // Handle successful login
      console.log("data after login: " + data.username);
      setUsername(data.username);
      setSocketUser(data.username);
      router.push('/feed');
      login();
      connectToWebSocket();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}> 
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit">Login</button>
        </form>

        <p>
          Forgot Password? <Link href="/ForgotPassword">Reset Password</Link>
        </p>

        <GoogleLoginComponent/>
        
        <p>
          Do not have account? <Link href="/Signup">Signup instead</Link>
        </p>
        {/*
        <p>
          Don't have an account? <Link href="/Signup">Signup instead</Link>
        </p>
        */}
      </div> 
    </div>
  );
};

export default Login;
