// loginServerAction.js
'use server';

import baseUrl from "../../../config";

export async function loginUser(formData) {
  console.log("1");
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
 
 
  const data = await response.json();
  console.log("resp : ",response)
  if (!response.ok) {
    if(response.status==401)
    {
      throw new Error('Invalid Credentials');
    }
    else if(response.status==450)
    {
      throw new Error('Verify Email');
    }
    throw new Error('Login failed');
  } 
  return data;
}

export async function logoutUser(formData) {
  //send server msg. server disables current token!
}
