import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function UpdatePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch('/users/me/password', { newPassword });
            setMessage('Password updated successfully');
            setError('');
            setNewPassword('');
        } catch (err) {
            if (Array.isArray(err.response?.data?.message)) {
                setError(err.response.data.message[0]);
            } else {
                setError(err.response?.data?.message || 'Failed to update password');
            }
            setMessage('');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '5vh' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center' }}>Update Password</h2>
                {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                {message && <div style={{ color: 'var(--secondary-color)', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password (8-16 chars, 1 uppercase, 1 special)</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Update Password</button>
                </form>
            </div>
        </div>
    );
}
