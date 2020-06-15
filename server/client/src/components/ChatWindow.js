import React, { useState } from 'react';
import styles from './ChatWindow.module.css';



const ChatWindow = ({ messages, handleSendMessage, handleLeave }) => {
    const [message, setMessage] = useState('');

    const handleOnChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendOnClick = (e) => {
        e.preventDefault()
        handleSendMessage(message);
        setMessage('');
    };

    const handleLeaveOnClick = () => {
        handleLeave();
    };
    // console.log("from messages");
    // console.log(messages);
    // if(message.username = )
    return (
      <div className={styles.wrapper}>
        <div className={styles.chat_window}>
            <form onSubmit={handleSendOnClick}>
            <input
                className={styles.chatBox}
                type="text"
                value={message}
                onChange={handleOnChange}/>
            </form>
            <button
                className={styles.sendButton}
                type="button"
                onClick={handleSendOnClick}
            >Send</button>
          {/* <button type='button' onClick={handleLeaveOnClick}>Leave</button> */}
          <div className={styles.messages}>
            {messages.map((m) => (
              <p key={m.id}>
                <strong>{m.username}:</strong> {m.message}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
};

export default ChatWindow;