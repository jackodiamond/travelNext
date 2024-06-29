'use server';

import baseUrl from "../../../config";

export const checkUsername = async () => {
  try {
    const response = await fetch(baseUrl+'/auth/usernames');
    if (!response.ok) {
      throw new Error('Failed to fetch usernames');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching usernames:', error);
    throw error;
  }
};

export const signupUser = async (formData) => {
  try {
    const response = await fetch(baseUrl+'/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    });

    console.log("signup response : ",response)
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};
