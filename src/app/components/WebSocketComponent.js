import eventEmitter from './eventEmitter';

const ENDPOINT = 'wss://ldcdvisihd.execute-api.ap-south-1.amazonaws.com/production/';
let ws;
let isConnected = false;
let socketUser;
let onlineUsers = []; 

const connectToWebSocket = () => {

  ws = new WebSocket(ENDPOINT);

  ws.onopen = () => {
    console.log('Connected to WebSocket server');
    isConnected = true;
    setNameHandler(socketUser);
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
   
    if (message.users) {
      onlineUsers = message.users; // Update the onlineUsers array
      console.log("event emit")
      eventEmitter.emit('updateUsers', onlineUsers);
    //  handleUsers(message.users);
    } else if (message.privateMessage) {
      console.log("private message")

      eventEmitter.emit('privateMessage');
    //  handlePrivateMessage(message.privateMessage);
    }

  };

  ws.onclose = () => {
    console.log('Disconnected from WebSocket server');
    isConnected = false;
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

const setSocketUser= (username) =>{
  socketUser = username;
}

const setNameHandler = (name) => {
  if (ws && isConnected && name.trim() !== '') {
    ws.send(JSON.stringify({ action: 'setUser', name }));
  }
};

const getUsers = () => {
  console.log("web socket 01")
  if (ws && isConnected) {
    console.log("web socket 02")
    ws.send(JSON.stringify({ action: 'userList' }));
  }
};

const sendMessageHandler = (to, message) => {
  if (ws && isConnected && message.trim() !== '' && to.trim() !== '') {
    ws.send(JSON.stringify({ action: 'sendMessage', to, message }));
  }
};

// Expose the functions for use in other parts of your application
export { connectToWebSocket, setNameHandler, getUsers, sendMessageHandler,setSocketUser,onlineUsers, eventEmitter};