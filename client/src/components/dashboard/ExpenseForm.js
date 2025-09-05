import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { getCurrencySymbol } from '../../utils/currency';
import './ExpenseForm.css';

const ExpenseForm = ({ expense, onSuccess, onCancel }) => {
  const { addExpense, updateExpense } = useExpenses();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    amount: expense?.amount || '',
    description: expense?.description || '',
    category: expense?.category || '',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };

    const result = expense 
      ? await updateExpense(expense._id, expenseData)
      : await addExpense(expenseData);

    if (result.success) {
      onSuccess && onSuccess();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // Get categories from user or use defaults
  const categories = currentUser?.categories && currentUser.categories.length > 0
    ? currentUser.categories
    : [
        { name: 'Food', color: '#FF6384' },
        { name: 'Transport', color: '#36A2EB' },
        { name: 'Entertainment', color: '#FFCE56' },
        { name: 'Utilities', color: '#4BC0C0' },
        { name: 'Shopping', color: '#9966FF' },
        { name: 'Healthcare', color: '#FF9F40' },
        { name: 'Other', color: '#FF6384' },
        { name : 'Vegitables',color:'#FF6433'}
      ];

  return (
    <div className="expense-form-container">
      <h3>{expense ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount ({getCurrencySymbol()})</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter description"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (expense ? 'Update' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;