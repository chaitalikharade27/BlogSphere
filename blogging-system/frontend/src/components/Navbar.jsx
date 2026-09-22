import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PenSquare, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-panel">
            <div className="container navbar-container">
                <Link to="/" className="nav-brand">
                    <span style={{ color: 'var(--primary)' }}>Blog</span>Sphere
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/create" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PenSquare size={18} /> Write
                            </Link>
                            <Link to="/profile" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserIcon size={18} /> Profile
                            </Link>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
