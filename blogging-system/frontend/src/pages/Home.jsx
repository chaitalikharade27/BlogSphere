import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Adjust if backend returns pagination wrapper
                const response = await api.get('/posts');
                // Assume the response body is either an array or has a content field
                setPosts(response.data.content || response.data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading amazing posts...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to <span style={{ color: 'var(--primary)' }}>BlogSphere</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>
            </div>

            <div className="blog-grid">
                {posts.map((post, index) => (
                    <Link to={`/post/${post.id}`} key={post.id} className="blog-card glass-panel" style={{ animationDelay: `${index * 0.1}s` }}>
                        {post.imageUrl ? (
                            <img 
                                src={`http://localhost:8080${post.imageUrl}`} 
                                alt={post.title} 
                                className="blog-image"
                            />
                        ) : (
                            <div className="blog-image" style={{ background: `linear-gradient(135deg, hsl(${(post.id * 137) % 360}, 70%, 50%), hsl(${((post.id * 137) % 360) + 40}, 70%, 50%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
                                {post.title.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="blog-content">
                            <h2 className="blog-title">{post.title}</h2>
                            <p className="blog-excerpt">
                                {post.content?.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                            </p>
                            <div className="blog-meta">
                                <span>{post.category?.name || 'General'}</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {posts.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No posts found. Check back later!
                </div>
            )}
        </div>
    );
}
