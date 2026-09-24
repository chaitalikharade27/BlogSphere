import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Full User state
    const [fullUser, setFullUser] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            // Fetch current user full details to check roles
            api.get('/users/me')
               .then(res => {
                   setFullUser(res.data);
                   const hasAdmin = res.data.role === 'ADMIN' || (res.data.roles && res.data.roles.some(r => r.name === 'ADMIN'));
                   if (!hasAdmin) {
                       navigate('/');
                   }
               })
               .catch(() => navigate('/'));
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!fullUser) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'dashboard') {
                    const res = await api.get('/admin/dashboard');
                    setStats(res.data);
                } else if (activeTab === 'users') {
                    const res = await api.get('/admin/users');
                    setData(res.data);
                } else if (activeTab === 'posts') {
                    const res = await api.get('/posts');
                    setData(res.data);
                } else if (activeTab === 'comments') {
                    const res = await api.get('/admin/comments');
                    setData(res.data);
                } else if (activeTab === 'categories') {
                    const res = await api.get('/categories');
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab, fullUser]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            await api.put(`/admin/users/${userId}/role?role=${newRole}`);
            setData(data.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user permanently? This will also delete their posts and comments!')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setData(data.filter(u => u.id !== userId));
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this post permanently?')) return;
        try {
            await api.delete(`/admin/posts/${postId}`);
            setData(data.filter(p => p.id !== postId));
        } catch (error) {
            alert('Failed to delete post');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment permanently?')) return;
        try {
            await api.delete(`/admin/comments/${commentId}`);
            setData(data.filter(c => c.id !== commentId));
        } catch (error) {
            alert('Failed to delete comment');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Delete this category? Posts in this category will lose their category association.')) return;
        try {
            await api.delete(`/admin/categories/${categoryId}`);
            setData(data.filter(c => c.id !== categoryId));
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        const name = e.target.categoryName.value;
        if (!name) return;
        try {
            const res = await api.post(`/admin/categories`, { name });
            setData([...data, res.data]);
            e.target.reset();
        } catch (error) {
            alert('Failed to create category');
        }
    };

    if (authLoading || !fullUser) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Admin Panel...</div>;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <span className="icon">📊</span> Dashboard
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <span className="icon">👥</span> Users
                    </button>
                    <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
                        <span className="icon">📝</span> Posts
                    </button>
                    <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => setActiveTab('comments')}>
                        <span className="icon">💬</span> Comments
                    </button>
                    <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
                        <span className="icon">🏷️</span> Categories
                    </button>
                </nav>
            </aside>

            <main className="admin-content">
                <header className="admin-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div className="admin-user-badge">
                        Logged in as <strong>{fullUser.name}</strong>
                    </div>
                </header>

                <div className="admin-body">
                    {loading ? (
                        <div className="loading-spinner">Loading data...</div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && stats && (
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Users</h3>
                                        <p className="stat-number">{stats.usersCount}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Posts</h3>
                                        <p className="stat-number">{stats.postsCount}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Comments</h3>
                                        <p className="stat-number">{stats.commentsCount}</p>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Likes</h3>
                                        <p className="stat-number">{stats.likesCount}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.id}</td>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.role || 'USER'}</td>
                                                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <select 
                                                            className="admin-select"
                                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                            value={u.role || 'USER'}
                                                            disabled={u.id === fullUser.id}
                                                        >
                                                            <option value="USER">USER</option>
                                                            <option value="ADMIN">ADMIN</option>
                                                        </select>
                                                        <button 
                                                            className="btn-danger" 
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={u.id === fullUser.id}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.id}</td>
                                                    <td><Link to={`/post/${p.id}`}>{((p.title || 'No Title').length > 40 ? (p.title || 'No Title').substring(0, 40) + '...' : (p.title || 'No Title'))}</Link></td>
                                                    <td>{p.user?.name || 'Unknown'}</td>
                                                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Unknown'}</td>
                                                    <td>
                                                        <button className="btn-danger" onClick={() => handleDeletePost(p.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'comments' && (
                                <div className="admin-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Content</th>
                                                <th>Author</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(c => (
                                                <tr key={c.id}>
                                                    <td>{c.id}</td>
                                                    <td>{c.content.substring(0, 50)}{c.content.length > 50 ? '...' : ''}</td>
                                                    <td>{c.user?.name || 'Unknown'}</td>
                                                    <td>
                                                        <button className="btn-danger" onClick={() => handleDeleteComment(c.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'categories' && (
                                <div className="admin-categories">
                                    <form className="admin-add-form" onSubmit={handleCreateCategory}>
                                        <input type="text" name="categoryName" placeholder="New Category Name" required className="admin-input" />
                                        <button type="submit" className="btn-primary">Add Category</button>
                                    </form>
                                    <div className="admin-table-container">
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map(c => (
                                                    <tr key={c.id}>
                                                        <td>{c.id}</td>
                                                        <td>{c.name}</td>
                                                        <td>
                                                            <button className="btn-danger" onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
