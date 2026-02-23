import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const COUNTRY_CODES = [
    { code: '+91', label: '🇮🇳 +91' },
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' },
    { code: '+61', label: '🇦🇺 +61' },
    { code: '+971', label: '🇦🇪 +971' },
    { code: '+81', label: '🇯🇵 +81' },
    { code: '+49', label: '🇩🇪 +49' },
    { code: '+33', label: '🇫🇷 +33' },
    { code: '+86', label: '🇨🇳 +86' },
    { code: '+65', label: '🇸🇬 +65' }
];

function getPasswordError(password) {
    if (!password) return '';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter (A-Z).';
    if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter (a-z).';
    if (!/[0-9]/.test(password)) return 'Add at least one number (0-9).';
    if (!/[!@#$%^&*]/.test(password)) return 'Add at least one special character (!@#$%^&*).';
    return '';
}

function getPasswordRules(password) {
    return [
        { label: 'Lowercase & Uppercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { label: 'Number (0-9)', met: /[0-9]/.test(password) },
        { label: 'Special Character (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
        { label: 'Atleast 8 Character', met: password.length >= 8 },
    ];
}

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const passwordError = getPasswordError(password);
    const passwordRules = getPasswordRules(password);
    const confirmError = confirmTouched && confirmPassword && password !== confirmPassword
        ? 'Passwords do not match.'
        : '';

    function handlePhoneChange(e) {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 10) {
            setPhoneNumber(val);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordError) {
            return setError(passwordError);
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        if (phoneNumber.length !== 10) {
            return setError('Phone number must be exactly 10 digits.');
        }

        try {
            setError('');
            setLoading(true);
            const fullPhone = countryCode + phoneNumber;
            await signup(email, password, name, age, fullPhone);
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
                    <h2>Create Account</h2>
                </div>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="signup-name">Full Name</label>
                        <input
                            id="signup-name"
                            type="text"
                            placeholder="Enter the name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-age">Age</label>
                        <input
                            id="signup-age"
                            type="number"
                            placeholder="Enter your age"
                            required
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-phone">Phone Number</label>
                        <div className="phone-input-group">
                            <select
                                className="country-code-select"
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                            >
                                {COUNTRY_CODES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                id="signup-phone"
                                type="tel"
                                placeholder="9876543210"
                                required
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                maxLength={10}
                                className="phone-number-input"
                            />
                        </div>
                        <span className="input-hint">{phoneNumber.length}/10 digits</span>
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            type="email"
                            placeholder="you@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {password && (
                            <div className="password-checklist">
                                {passwordRules.map((rule) => (
                                    <div
                                        key={rule.label}
                                        className={`password-rule ${rule.met ? 'rule-met' : 'rule-unmet'}`}
                                    >
                                        <span className="rule-icon">{rule.met ? '✔' : '✔'}</span>
                                        <span className="rule-text">{rule.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-confirm">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="signup-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => setConfirmTouched(true)}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {confirmError && (
                            <span className="field-error">{confirmError}</span>
                        )}
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
