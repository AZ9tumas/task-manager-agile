import { useState } from 'react';
import { api } from '../api.js';

export default function AuthPage({ onAuthenticated }) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isRegister = mode === 'register';

    function updateField(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function switchMode() {
        setMode(isRegister ? 'login' : 'register');
        setError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const result = isRegister
                ? await api.register(form)
                : await api.login({ email: form.email, password: form.password });
            onAuthenticated(result);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <form className="card auth-form" onSubmit={handleSubmit}>
                <h1>{isRegister ? 'Create an account' : 'Log in'}</h1>

                {isRegister && (
                    <label>
                        Name
                        <input name="name" value={form.name} onChange={updateField} required />
                    </label>
                )}
                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={updateField}
                        autoComplete="email"
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={updateField}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        minLength={isRegister ? 6 : undefined}
                        required
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <button className="button" type="submit" disabled={submitting}>
                    {submitting ? 'Please wait…' : isRegister ? 'Sign up' : 'Log in'}
                </button>

                <p className="auth-form__switch">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" className="link-button" onClick={switchMode}>
                        {isRegister ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </form>
        </div>
    );
}
