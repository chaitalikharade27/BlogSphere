import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [fullUser, setFullUser] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Fetch User Details
                const userRes = await api.get('/users/me');
                if (userRes.data) {
                    setFullUser(userRes.data);
                }

                // Fetch User's Posts
                const postsRes = await api.get('/posts/my-posts');
                if (postsRes.data) {
                    setMyPosts(postsRes.data);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        try {
            const res = await api.delete(`/posts/${postId}`);
            
            if (res.status === 200) {
                setMyPosts(myPosts.filter(p => p.id !== postId));
            } else {
                alert("Failed to delete post");
            }
        } catch(error) {
            console.error("Error deleting post:", error);
            alert("Error deleting post");
        }
    };

    const displayUser = fullUser || user;

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading profile...</div>;
    }

    if (!displayUser) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Please <Link to="/login" style={{color: 'var(--primary)'}}>login</Link> to view your profile.</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem' }}>
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                        {displayUser?.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{displayUser?.name || 'User Profile'}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>{displayUser?.email}</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                                <strong>Role:</strong> {displayUser?.roles ? displayUser.roles.map(r => r.name).join(', ') : 'USER'}
                            </span>
                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                                <strong>Status:</strong> Active
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Posts Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: 0 }}>My Posts</h3>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{myPosts.length} {myPosts.length === 1 ? 'Post' : 'Posts'}</span>
                </div>

                {myPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                            You haven't written any posts yet.
                        </p>
                        <Link to="/create" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '6px', display: 'inline-block' }}>
                            Write your first post!
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {myPosts.map(post => (
                            <div key={post.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', lineHeight: '1.4' }}>
                                        <Link to={`/post/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                                            {post.title}
                                        </Link>
                                    </h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                        Published: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/edit/${post.id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem', textDecoration: 'none', borderRadius: '6px' }}>Edit</Link>
                                    <button onClick={() => handleDelete(post.id)} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: 'rgba(255, 50, 50, 0.1)', color: '#ffaaaa', border: '1px solid rgba(255, 50, 50, 0.2)', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
