import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import ExpenseEditForm from './ExpenseEditForm';
import Loader from '../ui/Loader';
import './ExpenseList.css';

const ExpenseList = ({ expenses, showPagination = true }) => {
  const { loading, currentPage, totalPages, fetchExpenses, deleteExpense, filters } = useExpenses();
  const { currentUser } = useAuth();
  const [editingExpense, setEditingExpense] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleEditSuccess = () => {
    setEditingExpense(null);
    fetchExpenses(currentPage, filters);
  };

  const handlePageChange = (page) => {
    fetchExpenses(page, filters);
  };

  // Get category color function
  const getCategoryColor = (categoryName) => {
    if (currentUser?.categories) {
      const category = currentUser.categories.find(cat => cat.name === categoryName);
      if (category) return category.color;
    }
    
    // Default colors if not found
    const defaultColors = {
      'Food': '#FF6384',
      'Transport': '#36A2EB',
      'Entertainment': '#FFCE56',
      'Utilities': '#4BC0C0',
      'Shopping': '#9966FF',
      'Healthcare': '#FF9F40',
      'Other': '#FF6384'
    };
    
    return defaultColors[categoryName] || '#007bff';
  };

  if (loading && !expenses.length) {
    return <Loader />;
  }

  return (
    <div className="expense-list-container">
      {editingExpense && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <ExpenseEditForm
              expense={editingExpense}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        </div>
      )}
      
      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add your first expense to get started!</p>
        </div>
      ) : (
        <>
          <div className="expense-list">
            {expenses.map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                  <div className="expense-details">
                    <h4 className="expense-description">{expense.description}</h4>
                    <div className="expense-meta">
                      <span 
                        className="expense-category" 
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      >
                        {expense.category}
                      </span>
                      <span className="expense-date">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="expense-actions">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {showPagination && totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseList;