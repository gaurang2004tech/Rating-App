import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/">
                <h2>✨ RateApp</h2>
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <span className="mobile-hide" style={{ color: 'var(--text-muted)' }}>
                            {user.email} <span className="badge">{user.role}</span>
                        </span>
                        {user.role === 'admin' && <Link to="/admin/dashboard">Dashboard</Link>}
                        {user.role === 'store_owner' && <Link to="/owner/dashboard">Dashboard</Link>}
                        {user.role === 'user' && <Link to="/user/stores">Stores</Link>}
                        <Link to="/update-password" style={{ color: 'var(--text-color)', fontWeight: '500' }}>Settings</Link>
                        <button onClick={logout} style={{ background: 'var(--border-color)' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">
                            <button>Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};
