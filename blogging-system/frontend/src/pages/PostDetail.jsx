import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit, ThumbsUp, MessageSquare, Send } from 'lucide-react';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const [postRes, commentsRes, likesRes] = await Promise.all([
                    api.get(`/posts/${id}`),
                    api.get(`/posts/${id}/comments`),
                    api.get(`/posts/${id}/likes`).catch(() => ({ data: 0 }))
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
                setLikeCount(likesRes.data);
            } catch (err) {
                setError('Post not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
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

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like this post.');
            return;
        }
        try {
            await api.post(`/posts/${id}/like`);
            const likesRes = await api.get(`/posts/${id}/likes`);
            setLikeCount(likesRes.data);
        } catch (err) {
            // If already liked, try to unlike
            try {
                await api.delete(`/posts/${id}/like`);
                const likesRes = await api.get(`/posts/${id}/likes`);
                setLikeCount(likesRes.data);
            } catch (unlikeErr) {
                alert('Failed to toggle like.');
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) {
            alert('Please login to comment.');
            return;
        }
        try {
            const res = await api.post(`/posts/${id}/comments`, { content: newComment });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (err) {
            alert('Failed to add comment.');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment. ' + (err.response?.data?.message || ''));
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;
    if (error) return <div className="container error-message">{error}</div>;
    if (!post) return null;

    // We can assume user is owner if user is logged in for simplicity, 
    // ideally we'd check user ID from decoded JWT against post.user.id
    // But since backend enforces it, backend will return 403 if not authorized
    const isOwner = user && (user.id === post.user?.id || user.role === 'ADMIN');

    return (
        <div className="container post-detail" style={{ animation: 'slideUp 0.5s ease-out forwards' }}>
            <div className="post-header">
                <h1>{post.title}</h1>
                <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                    <span>By {post.user?.name || 'Unknown User'}</span>
                    <span>•</span>
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--primary)' }}>{post.category?.name || 'General'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={handleLike} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ThumbsUp size={16} /> 
                        <span>{likeCount} Likes</span>
                    </button>

                    {isOwner && (
                        <>
                            <Link to={`/edit/${post.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Edit size={16} /> Edit
                            </Link>
                            <button onClick={handleDelete} className="btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </>
                    )}
                </div>
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

            <div className="comments-section" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <MessageSquare size={20} />
                    Comments ({comments.length})
                </h3>

                {user ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="input-field"
                                rows="3"
                                style={{ paddingRight: '3rem', resize: 'vertical' }}
                            ></textarea>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', padding: '0.5rem', borderRadius: '50%' }}
                                disabled={!newComment.trim()}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Log in</Link> to join the conversation.
                    </div>
                )}

                <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-card glass-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--text-color)' }}>{comment.user?.name || 'User'}</strong>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-color)' }}>{comment.content}</p>
                            
                            {isOwner && (
                                <button 
                                    onClick={() => handleCommentDelete(comment.id)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', cursor: 'pointer', padding: 0 }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No comments yet. Be the first to share your thoughts!</div>
                    )}
                </div>
            </div>
        </div>
    );
}
