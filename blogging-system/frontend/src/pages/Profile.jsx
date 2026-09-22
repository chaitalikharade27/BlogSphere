import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const { user } = useContext(AuthContext);
    
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h1 style={{ marginBottom: '0.5rem' }}>{user?.name || 'User Profile'}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{user?.email || 'Logged in successfully'}</p>
                
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Account Details</h3>
                    <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> Active</p>
                    <p style={{ marginBottom: '0.5rem' }}><strong>Roles:</strong> User</p>
                    {/* Extend with more fetched data if backend supports /users/me */}
                </div>
            </div>
        </div>
    );
}
