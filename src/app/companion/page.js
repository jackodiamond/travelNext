'use client'
import React, { useState, useEffect, useContext } from 'react';
import TopNav from '../feed/TopNav';
import './companion.css'; 
import { useRouter } from 'next/navigation';
import UserContext from '../components/UserContext'; 
import { handleSendMessage } from '../profile/MessageServerAction';
import baseUrl from '../../../config';
import { eventEmitter, getUsers, sendMessageHandler } from '../components/WebSocketComponent';
import { fetchProfilePicture } from '../feed/feedServerAction';

const Companion = () => {
  const router = useRouter();
  const {username,isLoggedIn} = useContext(UserContext); 
  const [usersWithConversation, setUsersWithConversation] = useState([]);
  const [usersWithConversationBackup, setUsersWithConversationBackup] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversationVisible, setConversationVisible] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [unseenMessagesCount, setUnseenMessagesCount] = useState({});
  const [userPictures, setUserPictures] = useState({});

  useEffect(() => {
    const fetchUsersWithConversation = async () => {
      console.log("private message recieved");
      try {
        const response = await fetch(baseUrl+`/messages/companions/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUsersWithConversation(data.users);
          setUsersWithConversationBackup(data.users);

            // Iterate using a for loop
        for (let i = 0; i < data.users.length; i++) {
          console.log('User with conversation:', data.users[i]);
          fetchUnseenCountByUser(data.users[i],username);
          fetchProfilePic(data.users[i])
        }

        } else {
          console.error('Failed to fetch users with conversation:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users with conversation:', error);
      }
    };

    fetchUsersWithConversation();

    eventEmitter.on('privateMessage', fetchUsersWithConversation);
  }, [username]);

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to "Page Not Found" page if not logged in
      router.push('/404');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleUpdateUsers = (updatedUsers) => {
      console.log("updated users in companion : ",updatedUsers)
      setUsersWithConversation(updatedUsers);

      for (let i = 0; i < updatedUsers.length; i++) {
        console.log('User with conversation:', updatedUsers[i]);
     //   fetchUnseenCountByUser(data.users[i],username);
        fetchProfilePic(updatedUsers[i])
      }
    }; 

    eventEmitter.on('updateUsers', handleUpdateUsers);

    // Cleanup the event listener when the component is unmounted
    return () => {
      eventEmitter.off('updateUsers', handleUpdateUsers);
    };
  }, []);

  useEffect(() => {
    fetchConversation();
  }, [username, selectedUser]);

  const fetchConversation = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(baseUrl+`/messages/messages/${username}/${selectedUser}`);
        if (response.ok) {
          const data = await response.json();
          setConversation(data.messages);
          setConversationVisible(true);
        } else {
          console.error('Failed to fetch conversation:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    }
  };

  function getUnseenCount(username) {
    console.log("countaaaa ",unseenMessagesCount[username])
    return unseenMessagesCount[username] || 0;
  }

  const fetchUnseenCountByUser = async (senderName,recipientName) => {
    try {
      const response = await fetch(baseUrl+`/messages/unseen/byuser/${senderName}/${recipientName}`); 
      if (response.ok) {
        const data = await response.json();
        console.log("unseen count for each : ",data.unseenMessagesCount)
        setUnseenMessagesCount(prevState => ({
          ...prevState,
          [senderName]: data.unseenMessagesCount, 
        }));
      } else {
        console.error('Failed to fetch unseen messages count:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching unseen messages count:', error);
    }
  };

  const markAllMessagesAsSeen = async (senderName, recipientName) => {
    try {
      const response = await fetch(baseUrl+'/messages/seen', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: senderName,
          recipient: recipientName,
        }),
      });
  
      if (response.ok) {
        console.log('All messages marked as seen');
      } else {
        console.error('Failed to mark messages as seen:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    markAllMessagesAsSeen(user,username)
    setUnseenMessagesCount(prevState => ({
      ...prevState,
      [user]: 0, 
    }));
  };

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleMessage = async () => {
    if (messageInput !== '') {
      const response = await handleSendMessage(username, selectedUser,  messageInput );
      if(response)
      {
        setMessageInput('');
        fetchConversation();
        sendMessageHandler(selectedUser,messageInput);
      }
    }
  };

  const onOnlineUser= (users) => {
    console.log("online users ",users);
  };

  const fetchProfilePic = async (name) => {
    if(userPictures[name])
    {
      return;
    }
    var data = await fetchProfilePicture(name);
    console.log("profile pic : ", data);
    if (data === undefined) {
      data = '/user.png';
    }
    setUserPictures(prevState => ({
      ...prevState,
      [name]: data || '/user.png', // Default picture if none found
  }));
  }

  const handleMessageToggle = ()=> {
    console.log("handle message toggle ",usersWithConversationBackup)
    setUsersWithConversation(usersWithConversationBackup);
  }

  return (
    <>
      <TopNav showImageIcon={false} showMessageToggle={true} handleMessageToggle={handleMessageToggle} />
      <div className="companion-page">
        {usersWithConversation.length !== 0 ? (
          <div>
            <ul>
              {usersWithConversation.map((user) => (

                
                <li
                  key={user}
                  onClick={() => handleUserClick(user)}
                  className={`user-list-item ${selectedUser === user ? 'selected' : ''}`}
                >
                  <img src={userPictures[user]} alt={`Profile picture for ${user}`} className="user-profile-pic rounded-full " />
                  
                  <span className="ml-5">{user} </span>{' '}
                  {unseenMessagesCount[user] !== 0 ? (<span className="text-red-500 text-xs ml-2"> {unseenMessagesCount[user]}</span>
                  ):(<></>)}

                                    
                  <span className={`status-icon ${usersWithConversationBackup.includes(user) ? 'online' : 'offline'}`}>
                    {usersWithConversationBackup.includes(user) ? (
                      <img src="./online.png" alt="Online" className="status-icon" />
                    ) : (
                      <img src="./offline.png" alt="Offline" className="status-icon" />
                    )}
                  </span>
                  

                </li>

              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Message users to make companions!</p>
            </div>
          </div>
        )}
        <div className={`conversation-container ${conversationVisible ? 'visible' : ''}`}>
          <div className="conversation">
            <ul>
              {conversation.map((message, index) => (
                <li key={message._id} className={`message ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <div className="username">{message.message.sender}</div>
                  <div className="message-text">{message.message.message}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="input-container">
            <input type="text" value={messageInput} onChange={handleInputChange} placeholder="Type your message..." />
            <button onClick={handleMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Companion;
