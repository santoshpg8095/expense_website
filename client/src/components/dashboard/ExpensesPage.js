// client/src/components/dashboard/ExpensesPage.js
import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Loader from '../ui/Loader';
import './ExpensesPage.css';

const ExpensesPage = () => {
  const { expenses, loading, fetchExpenses, filters } = useExpenses();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchExpenses(1, filters);
  }, []);

  const handleFilterChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    const activeFilters = {};
    if (localFilters.category) activeFilters.category = localFilters.category;
    if (localFilters.startDate) activeFilters.startDate = localFilters.startDate;
    if (localFilters.endDate) activeFilters.endDate = localFilters.endDate;
    
    fetchExpenses(1, activeFilters);
  };

  const clearFilters = () => {
    setLocalFilters({
      category: '',
      startDate: '',
      endDate: ''
    });
    fetchExpenses(1, {});
  };

  const handleExpenseAdded = () => {
    setShowForm(false);
    fetchExpenses(1, filters);
  };

  // Get categories for filter dropdown
  const categories = currentUser?.categories && currentUser.categories.length > 0
    ? currentUser.categories
    : [
        { name: 'Food', color: '#FF6384' },
        { name: 'Transport', color: '#36A2EB' },
        { name: 'Entertainment', color: '#FFCE56' },
        { name: 'Utilities', color: '#4BC0C0' },
        { name: 'Shopping', color: '#9966FF' },
        { name: 'Healthcare', color: '#FF9F40' },
        { name: 'Other', color: '#FF6384' }
      ];

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>
      
      {showForm && (
        <div className="page-section">
          <ExpenseForm onSuccess={handleExpenseAdded} />
        </div>
      )}
      
      <div className="page-section">
        <div className="filters">
          <h3>Filters</h3>
          <div className="filter-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={localFilters.category}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={localFilters.startDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={localFilters.endDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={applyFilters} className="btn btn-primary">
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="page-section">
        {loading && !expenses.length ? (
          <Loader />
        ) : (
          <ExpenseList expenses={expenses} showPagination={true} />
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;