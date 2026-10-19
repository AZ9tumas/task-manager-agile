import { useEffect, useState } from 'react';
import { getMe } from './api.js';
import Login from './components/Login.jsx';
import Board from './components/Board.jsx';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setLoading(false);
            return;
        }

        getMe()
            .then((data) => setUser(data.user))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    function handleLogin(data) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setUser(null);
    }

    if (loading) {
        return <p className="message">Loading...</p>;
    }

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div>
            <header className="header">
                <h1>Task Manager</h1>
                <div>
                    <span className="username">Hi, {user.name}</span>
                    <button className="btn btn-grey" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </header>
            <Board />
        </div>
    );
}

export default App;
