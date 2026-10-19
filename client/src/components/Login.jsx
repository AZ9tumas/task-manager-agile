import { useState } from 'react';
import { login, register } from '../api.js';

function Login({ onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            let data;
            if (isSignUp) {
                data = await register(name, email, password);
            } else {
                data = await login(email, password);
            }
            onLogin(data);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="login-page">
            <form className="box login-box" onSubmit={handleSubmit}>
                <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>

                {isSignUp && (
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button className="btn" type="submit">
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </button>

                <p className="switch">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button type="button" className="link" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Login;
