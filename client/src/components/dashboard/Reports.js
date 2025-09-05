// client/src/components/dashboard/Reports.js
import React, { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/currency';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Loader from '../ui/Loader';
import './Reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { getExpenseSummary } = useExpenses();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Memoize the loadSummary function to prevent unnecessary re-renders
  const loadSummary = useCallback(async () => {
    setLoading(true);
    const result = await getExpenseSummary(dateRange);
    if (result.success) {
      setSummary(result.data);
    }
    setLoading(false);
  }, [getExpenseSummary, dateRange]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    loadSummary();
  };

  const handleClearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    // loadSummary will be called automatically via useEffect when dateRange changes
  };

  if (loading) {
    return <Loader />;
  }

  const barChartData = {
    labels: summary?.byCategory.map(item => item._id) || [],
    datasets: [
      {
        label: 'Expenses by Category',
        data: summary?.byCategory.map(item => item.total) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: summary?.byCategory.map(item => item._id) || [],
    datasets: [
      {
        data: summary?.byCategory.map(item => item.total) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Expense Reports</h1>
      </div>
      <div className="page-section">
        <div className="filters">
          <h3>Date Range</h3>
          <div className="filter-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="filter-actions">
            <button onClick={handleApplyFilters} className="btn btn-primary">
              Apply Filters
            </button>
            <button onClick={handleClearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      {summary && (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <p className="summary-amount">
                {formatCurrency(summary.overall.totalExpenses)}
              </p>
              <p className="summary-count">{summary.overall.count} transactions</p>
            </div>
            
            <div className="summary-card">
              <h3>Average Expense</h3>
              <p className="summary-amount">
                {formatCurrency(summary.overall.averageExpense)}
              </p>
            </div>
            
            <div className="summary-card">
              <h3>Time Period</h3>
              <p className="summary-period">
                {dateRange.startDate || 'Beginning'} to {dateRange.endDate || 'Now'}
              </p>
            </div>
          </div>
          <div className="charts-container">
            <div className="chart-card">
              <h3>Expenses by Category (Bar)</h3>
              <div className="chart-wrapper">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Expenses by Category (Doughnut)</h3>
              <div className="chart-wrapper">
                <Doughnut data={doughnutChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="category-breakdown">
            <h3>Category Breakdown</h3>
            <div className="breakdown-list">
              {summary.byCategory.map((item, index) => (
                <div key={index} className="breakdown-item">
                  <div className="breakdown-category">{item._id}</div>
                  <div className="breakdown-amount">
                    {formatCurrency(item.total)}
                  </div>
                  <div className="breakdown-count">
                    {item.count} transactions
                  </div>
                  <div className="breakdown-percentage">
                    {((item.total / summary.overall.totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;