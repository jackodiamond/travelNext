// UserContext.js
'use client'
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  // Functions to update login state (replace with your authentication logic)
  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <UserContext.Provider value={{ username, setUsername,author,setAuthor, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
