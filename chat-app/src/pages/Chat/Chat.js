import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ username }) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');

  
    // Set up WebSocket connection
    useEffect(() => {
        // Create Scaledrone connection
        const drone = new window.Scaledrone('Dif2QWNdWG7kBHJL', {
            data: {
                username: username
            }
        });
    
        window.drone = drone;
        // First open drone connection
        drone.on('open', error => {
            if (error) {
                setConnectionStatus('error');
                return console.error(error);
            }
            setConnectionStatus('connected');
            console.log('Successfully connected to Scaledrone');
        });
    
        // Subscribe to room
        const room = drone.subscribe('observable-room');
    
        // Room opened
        room.on('open', error => {
            if (error) {
                return console.error(error);
            }
            console.log('Successfully joined room');
        });
    
        // List of currently online members
        room.on('members', members => {
            console.log('Current members:', members);
            setOnlineUsers(members.map(member => member.clientData.username));
        });
    
        // User joined
        room.on('member_join', member => {
            console.log('Member joined:', member);
            setOnlineUsers(prev => [...prev, member.clientData.username]);
        });
    
        // User left
        room.on('member_leave', member => {
            console.log('Member left:', member);
            setOnlineUsers(prev => 
                prev.filter(user => user !== member.clientData.username)
            );
        });
    
        // Handle messages
        room.on('message', message => {
            console.log('Received message:', message);
            const {data, member} = message;
            setMessages(prev => [...prev, {
                text: data,
                sender: member.clientData.username,
                time: new Date().toLocaleTimeString()
            }]);
        });
    
        // Cleanup
        return () => drone.close();
    }, [username]);

    // Scroll to bottom effect
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            window.drone.publish({
                room: 'observable-room',
                message: newMessage
            });
            
            // Clear input
            setNewMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3>Online Users</h3>
                <ul className="users-list">
                    {onlineUsers.map((user, index) => (
                        <li key={index} className={user === username ? 'current-user' : ''}>
                            {user} {user === username ? '(You)' : ''}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-main">
                <div className="chat-header">
                    Logged in as: {username}
                    <div className={`connection-status ${connectionStatus}`}>
                    {connectionStatus === 'connected' && '🟢 Connected'}
                    {connectionStatus === 'connecting' && '🟡 Connecting...'}
                    {connectionStatus === 'disconnected' && '🔴 Disconnected'}
                    {connectionStatus === 'error' && '⚠️  Connection Error'}
                 </div>
                </div>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender === username ? 'message-own' : 'message-other'}`}>
                            <strong>{message.sender}: </strong>
                            {message.text}
                            <span className="time">{message.time}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="chat-input-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}

export default Chat;