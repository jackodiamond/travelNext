import React, { useState, useEffect } from 'react';
import './MessagingComponent.css'; // Ensure the path is correct
import { handleSendMessage } from './MessageServerAction';
import baseUrl from '../../../config';

const MessagingComponent = ({ senderName, recipientName }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from server when component mounts
    fetchMessages();
  }, []);

  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

 
  const  handleMessage = async () => {
    console.log("send 11")
   const response = await handleSendMessage(senderName,recipientName,messageInput)
   console.log("send 12 ",response)

   if(response)
    {
      setMessageInput('')
      fetchMessages()

    }
  
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(baseUrl+`/messages/messages/${senderName}/${recipientName}`);
      if (response.ok) { // Checks if the HTTP status code is in the range 200-299
        const data = await response.json();
        setMessages(data.messages);
        console.log("fetched messages:", data.messages);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  return (
    <div className={`messaging-component ${isMaximized ? 'maximized' : 'minimized'}`}>
      <div className="toggle-button" onClick={toggleMaximized}>
        {isMaximized ? 'Minimize' : 'Maximize'}
      </div>
      {isMaximized && (
        <div className='maximized-view'>
          <div className='messages'>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.sender === senderName ? 'sent' : 'received'}`}
              >
                {message.message.message}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={handleInputChange}
            />
            <button onClick={handleMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingComponent;
