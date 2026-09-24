import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search } from 'lucide-react';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let url = '/posts';
                if (searchQuery) {
                    url = `/posts/search?keyword=${searchQuery}`;
                } else if (selectedCategory) {
                    url = `/posts/category/${selectedCategory}`;
                }
                const response = await api.get(url);
                setPosts(response.data.content || response.data || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPosts();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    if (initialLoad) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ color: 'var(--text-muted)' }}>Loading amazing posts...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to <span style={{ color: 'var(--primary)' }}>BlogSphere</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>
            </div>

            <div className="search-section" style={{ maxWidth: '800px', margin: '0 auto 4rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="search-bar-wrapper" style={{ position: 'relative', width: '100%' }}>
                    <Search size={22} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search for articles, topics, or writers..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(null); }}
                        style={{ 
                            padding: '1.2rem 1.5rem 1.2rem 60px', 
                            width: '100%', 
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: 'var(--text-color)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.06)';
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.03)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                        }}
                    />
                </div>
                
                <div 
                    className="categories-scroll-container" 
                    style={{ 
                        position: 'relative', 
                        width: '100%', 
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}
                >
                    <div 
                        className="categories-list" 
                        style={{ 
                            display: 'flex', 
                            gap: '0.75rem', 
                            overflowX: 'auto', 
                            paddingBottom: '0.5rem',
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE/Edge
                        }}
                    >
                        {/* Hide scrollbar for Chrome/Safari/Opera */}
                        <style>{`.categories-list::-webkit-scrollbar { display: none; }`}</style>
                        <button
                            className={`btn ${!selectedCategory && !searchQuery ? 'btn-primary' : ''}`}
                            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                            style={{ 
                                padding: '0.5rem 1.5rem', 
                                borderRadius: '50px', 
                                fontSize: '0.9rem', 
                                background: !selectedCategory && !searchQuery ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: !selectedCategory && !searchQuery ? 'white' : 'var(--text-color)',
                                border: '1px solid transparent',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => { if (selectedCategory || searchQuery) e.target.style.background = 'rgba(255,255,255,0.1)' }}
                            onMouseLeave={(e) => { if (selectedCategory || searchQuery) e.target.style.background = 'rgba(255,255,255,0.05)' }}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`btn ${selectedCategory === cat.id ? 'btn-primary' : ''}`}
                                onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                                style={{ 
                                    padding: '0.5rem 1.5rem', 
                                    borderRadius: '50px', 
                                    fontSize: '0.9rem',
                                    background: selectedCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: selectedCategory === cat.id ? 'white' : 'var(--text-color)',
                                    border: '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}
                                onMouseEnter={(e) => { if (selectedCategory !== cat.id) e.target.style.background = 'rgba(255,255,255,0.1)' }}
                                onMouseLeave={(e) => { if (selectedCategory !== cat.id) e.target.style.background = 'rgba(255,255,255,0.05)' }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Searching...</div>
            ) : (
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
                                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                        {post.category?.name || 'General'}
                                    </span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            
            {!loading && posts.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or selecting a different category.</p>
                </div>
            )}
        </div>
    );
}
