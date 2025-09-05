import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';  // Added this import
import './CategoryManager.css';

const CategoryManager = () => {
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState(currentUser?.categories || []);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#007bff' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;
        setLoading(true);
        try {
            const updatedCategories = [...categories, newCategory];
            await api.put('/auth/update-categories', { categories: updatedCategories });
            setCategories(updatedCategories);
            setNewCategory({ name: '', color: '#007bff' });
            setMessage('Category added successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to add category');
        }
        setLoading(false);
    };

    const handleRemoveCategory = async (index) => {
        setLoading(true);
        try {
            const updatedCategories = categories.filter((_, i) => i !== index);
            await api.put('/auth/update-categories', { categories: updatedCategories });  // Changed from axios to api
            setCategories(updatedCategories);
            setMessage('Category removed successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to remove category');
        }
        setLoading(false);
    };

    return (
        <div className="category-manager">
            <div className="page-header">
                <h1>Manage Categories</h1>
            </div>
            {message && (
                <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
            <div className="page-section">
                <div className="add-category-form">
                    <h3>Add New Category</h3>
                    <form onSubmit={handleAddCategory}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="form-input"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Color</label>
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className="form-input color-input"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="page-section">
                <div className="categories-list">
                    <h3>Your Categories</h3>
                    {categories.length === 0 ? (
                        <p className="empty-state">No categories yet. Add your first category above.</p>
                    ) : (
                        <div className="category-grid">
                            {categories.map((category, index) => (
                                <div key={index} className="category-item">
                                    <div
                                        className="category-color"
                                        style={{ backgroundColor: category.color }}
                                    ></div>
                                    <span className="category-name">{category.name}</span>
                                    <button
                                        onClick={() => handleRemoveCategory(index)}
                                        className="btn btn-sm btn-danger"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;