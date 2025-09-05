import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Loader from '../ui/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { expenses, loading, fetchExpenses, getExpenseSummary } = useExpenses();
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExpenses(1);
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const result = await getExpenseSummary();
    if (result.success) {
      setSummary(result.data);
    }
  };

  const handleExpenseAdded = () => {
    setShowForm(false);
    fetchExpenses(1);
    loadSummary();
  };

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
      
      {showForm && (
        <div className="dashboard-form">
          <ExpenseForm onSuccess={handleExpenseAdded} />
        </div>
      )}
      
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
      
      <div className="recent-expenses">
        <h2>Recent Expenses</h2>
        <ExpenseList 
          expenses={expenses.slice(0, 5)} 
          showPagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;