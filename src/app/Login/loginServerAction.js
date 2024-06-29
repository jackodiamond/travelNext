// loginServerAction.js
'use server';

import baseUrl from "../../../config";

export async function loginUser(formData) {
  const response = await fetch(baseUrl+'/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password
    })
  });
  console.log("resp : ",response)
  if (!response.ok) {
    throw new Error('Login failed');
  } 

  const data = await response.json();
  return data;
}

export async function logoutUser(formData) {
  //send server msg. server disables current token!
}
