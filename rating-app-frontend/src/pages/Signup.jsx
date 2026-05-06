import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            if (Array.isArray(err.response?.data?.message)) {
                setError(err.response.data.message[0]);
            } else {
                setError(err.response?.data?.message || 'Signup failed');
            }
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '5vh' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center' }}>Create Account</h2>
                {error && <div className="error-text" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name (20-60 characters)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password (8-16 chars, 1 uppercase, 1 special)</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
