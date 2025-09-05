import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const ExpenseContext = createContext();

export const useExpenses = () => {
  return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const fetchExpenses = async (page = 1, newFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...newFilters
      }).toString();
      const response = await api.get(`/expenses?${params}`);  // Updated to include /expenses prefix
      setExpenses(response.data.expenses);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages);
      setFilters(newFilters);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);  // Updated to include /expenses prefix
      await fetchExpenses(currentPage, filters);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add expense' 
      };
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);  // Updated to include /expenses prefix
      await fetchExpenses(currentPage, filters);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update expense' 
      };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);  // Updated to include /expenses prefix
      await fetchExpenses(currentPage, filters);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete expense' 
      };
    }
  };

  const getExpenseSummary = async (dateRange = {}) => {
    try {
      const params = new URLSearchParams(dateRange).toString();
      const response = await api.get(`/expenses/summary/stats?${params}`);  // Updated to include /expenses prefix
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to get summary' 
      };
    }
  };

  const value = {
    expenses,
    loading,
    currentPage,
    totalPages,
    filters,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};