import { useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';
import AuthPage from './components/AuthPage.jsx';
import Board from './components/Board.jsx';

export default function App() {
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(Boolean(getToken()));

    useEffect(() => {
        if (!getToken()) return;
        api
            .me()
            .then(({ user }) => setUser(user))
            .catch(() => setToken(null))
            .finally(() => setCheckingSession(false));
    }, []);

    function handleAuthenticated({ token, user }) {
        setToken(token);
        setUser(user);
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    if (checkingSession) {
        return <p className="centered">Loading…</p>;
    }

    if (!user) {
        return <AuthPage onAuthenticated={handleAuthenticated} />;
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Task Manager</h1>
                <div className="app-header__user">
                    <span>{user.name}</span>
                    <button className="button button--secondary" onClick={logout}>
                        Log out
                    </button>
                </div>
            </header>
            <Board onUnauthorized={logout} />
        </div>
    );
}
