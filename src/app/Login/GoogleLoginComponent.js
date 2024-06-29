'use client'

import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import UserContext from '../components/UserContext';
import { useRouter } from 'next/navigation';
import baseUrl from '../../../config';

const clientId = '966194525011-ofeb7gv0v4coqfvupvh76sdv3bv9la0n.apps.googleusercontent.com'; // Replace with your actual Client ID

const GoogleLoginComponent = () => {
  const { setUsername, login } = useContext(UserContext);
  const router = useRouter(); 

  const responseGoogle = async (response) => {
    console.log("resp : ",response)
    const decodedUser = jwtDecode(response.credential);
    console.log("hoja bhai : ",decodedUser)
   
    const email = decodedUser.email;
    const name = decodedUser.name;

    console.log("email ",decodedUser.email)
    console.log("name :",decodedUser.name)

       // Send the decoded user information to the backend
       const res = await fetch(baseUrl+'/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name
        })
      });
  
      if (!res.ok) {
        throw new Error('Failed to log in with Google');
      }
  
      const data = await res.json();
      console.log('Backend response:', data);
      setUsername(data.username);
      router.push('/feed');
      login();
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;