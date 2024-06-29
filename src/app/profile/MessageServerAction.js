'use server'

import baseUrl from "../../../config";

export async function handleSendMessage(senderName, recipientName, messageInput) {
  if (messageInput.trim() !== '') {
    try {
      const response = await fetch(baseUrl+'/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: senderName,
          recipient: recipientName,
          messageContent: messageInput,
        }),
      });

      if (response.ok) {
        // Message sent successfully, clear input and fetch updated messages
       // setMessageInput('');
       // await fetchMessages();
       console.log("reponse ok")
       return true;
      } else {
        console.error('Failed to send message:', response.statusText);
        return false;
      }

     // return response; // Return the response object

    
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};