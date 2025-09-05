import React, { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Loader from '../ui/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { expenses, loading, error, fetchExpenses, getExpenseSummary } = useExpenses();
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Memoize the loadSummary function to prevent unnecessary re-renders
  const loadSummary = useCallback(async () => {
    setSummaryError(null);
    try {
      const result = await getExpenseSummary();
      if (result.success) {
        setSummary(result.data);
      } else {
        setSummaryError(result.message);
      }
    } catch (err) {
      setSummaryError('Failed to load summary data');
      console.error('Summary error:', err);
    }
  }, [getExpenseSummary]);

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      setAuthError('User not authenticated. Please log in again.');
      return;
    }

    // Fetch data
    fetchExpenses(1);
    loadSummary();
  }, [fetchExpenses, loadSummary, currentUser]);

  const handleExpenseAdded = () => {
    setShowForm(false);
    fetchExpenses(1);
    loadSummary();
  };

  // Show authentication error
  if (authError) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Authentication Error</h3>
          <p>{authError}</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && !expenses.length) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser?.username}!</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>
      
      {/* Show API errors */}
      {error && (
        <div className="error-message">
          <h3>Error Loading Expenses</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchExpenses(1)} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      )}
      
      {showForm && (
        <div className="dashboard-form">
          <ExpenseForm onSuccess={handleExpenseAdded} />
        </div>
      )}
      
      {summaryError && (
        <div className="error-message">
          <h3>Error Loading Summary</h3>
          <p>{summaryError}</p>
          <button 
            onClick={loadSummary} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Show summary if available */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Spent</h3>
            <p className="summary-amount">
              {formatCurrency(summary.overall.totalExpenses)}
            </p>
          </div>
          <div className="summary-card">
            <h3>Average Expense</h3>
            <p className="summary-amount">
              {formatCurrency(summary.overall.averageExpense)}
            </p>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p className="summary-amount">{summary.overall.count}</p>
          </div>
        </div>
      )}
      
      {/* Show expenses list */}
      <div className="recent-expenses">
        <h2>Recent Expenses</h2>
        <ExpenseList 
          expenses={expenses.slice(0, 5)} 
          showPagination={false}
        />
      </div>
      
      {/* Show empty state if no data */}
      {!expenses.length && !loading && !error && (
        <div className="empty-state">
          <h3>No Expenses Yet</h3>
          <p>Add your first expense to get started!</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-primary"
          >
            Add Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;