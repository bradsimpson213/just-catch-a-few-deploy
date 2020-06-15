import React, { useState, useEffect, useRef } from 'react';
import uniqid from 'uniqid'; 
import { baseWSUrl } from './config'

import Home from './components/Home';
import GameBoard from './components/GameBoard';


const App = (props) => {
  const [username, setUsername] = useState('');
  const [game, setGame] = useState(null);
  const [messages, setMessages] = useState([]);
  const webSocket = useRef(null);

  const ws = new WebSocket(`${baseWSUrl}`);

  const sendMessage = (type, data) => {
    const message = JSON.stringify({
      type,
      data,
    });
  ws.send(message);
  };

  useEffect(() => {
     if (!username) {
      return;
    }

    
    ws.onopen = (e) => {
      console.log(`Connection open: ${e}`);
      sendMessage('add-new-player', { username });
      setMessages([]);
    };

    ws.onmessage = (e) => {
      console.log(`Processing incoming message ${e.data}...`);

      const message = JSON.parse(e.data);

      switch (message.type) {
        case 'start-game':
        case 'update-game':
        case 'end-game':
          setGame(message.data);
          break;
        case "add-chat-message": {
          const chatMessage = JSON.parse(e.data);
          const message = chatMessage.data;
          message.created = new Date(message.created);

          setMessages([chatMessage.data, ...messages]);
        } break;
        default:
          throw new Error(`Unknown message type: ${message.type}`);
      }
      console.log(game);
    };
    ws.onerror = (e) => {
      console.error(e);
    };

    ws.onclose = (e) => {
      console.log(`Connection closed: ${e}`);
      webSocket.current = null;
      setUsername('');
      setMessages([]);
    };

    webSocket.current = ws;
 
    return function cleanup() {
      if (webSocket.current !== null) {
        webSocket.current.close();
      }
    };
  }, [username]);

  useEffect(() => {
    return function cleanup() {
      if (webSocket.current !== null) {
        webSocket.current.close();
      }
    };
  }, [])

  // useEffect(() => {
  //   if (webSocket.current !== null) {
    
  //     webSocket.current.onmessage = (e) => {
  //       console.log(`Processing incoming message ${e.data}...`);

  //       const chatMessage = JSON.parse(e.data);
  //       const message = chatMessage.data;
  //       message.created = new Date(message.created);

  //       setMessages([chatMessage.data, ...messages]);
  //     };
  //   }
  // }, [messages]);

  const updateUsername = (username) => {
    setUsername(username);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: uniqid(),
      username,
      message,
      created: new Date(),
    }

    const jsonNewMessage = JSON.stringify({
      type: 'send-chat-message',
      data: newMessage,
      // player: username,
    });

    console.log(`Sending message ${jsonNewMessage}...`);

    webSocket.current.send(jsonNewMessage);
  };

  const handleLeave = () => {
    setUsername('');
  };

  return (
    <>
      {username ? (
        <GameBoard messages={messages} handleSendMessage={handleSendMessage}
        handleLeave={handleLeave} />) : ( <Home updateUsername={updateUsername} />)};
    </>
  );
}

export default App;
