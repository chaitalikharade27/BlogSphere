import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit } from 'lucide-react';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Post not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            alert('Failed to delete post. ' + (err.response?.data?.message || ''));
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;
    if (error) return <div className="container error-message">{error}</div>;
    if (!post) return null;

    // We can assume user is owner if user is logged in for simplicity, 
    // ideally we'd check user ID from decoded JWT against post.user.id
    // But since backend enforces it, backend will return 403 if not authorized
    const isOwner = user?.isAuthenticated; // Simplified check for UI

    return (
        <div className="container post-detail" style={{ animation: 'slideUp 0.5s ease-out forwards' }}>
            <div className="post-header">
                <h1>{post.title}</h1>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                    <span>By {post.user?.name || 'Unknown User'}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--primary)' }}>{post.category?.name || 'General'}</span>
                </div>
                
                {isOwner && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Link to={`/edit/${post.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            <Edit size={16} /> Edit
                        </Link>
                        <button onClick={handleDelete} className="btn" style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}
            </div>

            {post.imageUrl ? (
                <img 
                    src={`http://localhost:8080${post.imageUrl}`} 
                    alt={post.title} 
                    className="post-hero-image glass-panel"
                />
            ) : (
                <div className="post-hero-image glass-panel" style={{ background: `linear-gradient(135deg, hsl(${(post.id * 137) % 360}, 70%, 50%), hsl(${((post.id * 137) % 360) + 40}, 70%, 50%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '5rem', fontWeight: 'bold' }}>
                    {post.title.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="post-body">
                {post.content}
            </div>
            
            {/* Comments Section could go here later */}
        </div>
    );
}
