import React, { useState } from 'react';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';

function App() {
    const [loggedInUser, setLoggedInUser] = useState('');
    console.log('App.js: Current loggedInUser is:', loggedInUser);

    return (
        <div>
            {!loggedInUser ? (
                <Login onLogin={setLoggedInUser} />
            ) : (
                <Chat username={loggedInUser} />
            )}
        </div>
    );
}

export default App;