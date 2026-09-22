import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Editor() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(isEdit);



    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const res = await api.get(`/posts/${id}`);
                    setTitle(res.data.title);
                    setContent(res.data.content);
                    if (res.data.category) setCategoryName(res.data.category.categoryTitle || res.data.category.name);
                } catch (err) {
                    setError('Failed to load post for editing.');
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title || !content || !categoryName) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (categoryName) {
                formData.append('categoryName', categoryName);
            }
            if (image) {
                formData.append('image', image);
            }

            let postId = id;

            if (!isEdit) {
                const res = await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                postId = res.data.id;
            } else {
                await api.put(`/posts/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate(`/post/${postId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post.');
            console.error(err);
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container editor-container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
                <div className="form-group">
                    <label className="label">Title</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Post Title"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="label">Category</label>
                    <input 
                        type="text"
                        className="input-field" 
                        value={categoryName} 
                        onChange={e => setCategoryName(e.target.value)}
                        placeholder="e.g. Technology, Lifestyle..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="label">Cover Image</label>
                    <input 
                        type="file" 
                        className="input-field" 
                        onChange={e => setImage(e.target.files[0])}
                        accept="image/*"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Content</label>
                    <textarea 
                        className="input-field" 
                        rows="12"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Write your story here..."
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update Post' : 'Publish'}
                    </button>
                </div>
            </form>
        </div>
    );
}
