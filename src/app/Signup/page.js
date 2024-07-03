// components/Signup.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signupUser, checkUsername } from './signupServerAction'; // Separate server actions for signup and username check
import './signup.css'; // Import the CSS file directly
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {


    e.preventDefault();
    try {
      // Check if the username already exists
      const existingUsernames = await checkUsername();
      if (existingUsernames.includes(formData.username)) {
        alert('Username already exists. Please choose a different username.');
        return; // Exit function if username already exists
      }

      // If the username is unique, proceed with signup
      const data = await signupUser(formData);
      console.log('Signup successful:', data);
      alert('Verification Email Sent');
      router.push('/Login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
    
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="signup-input"
            
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
            
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="signup-input"
            
          />
          <button type="submit">Signup</button>
        </form>
        <p className="login-instead-text">
          Already have an account? <Link href="/Login">Login instead</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
