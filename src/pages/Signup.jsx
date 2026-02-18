import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, name);
            navigate('/login');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">✅</span>
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Sign up to start managing your tasks.</p>
                </div>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="signup-name">Full Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            placeholder="At least 6 characters"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-confirm">Confirm Password</label>
                        <input
                            id="signup-confirm"
                            type="password"
                            placeholder="Re-enter password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button className="primary-btn" type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
