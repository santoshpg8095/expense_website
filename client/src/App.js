import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PrivateRoute from './components/ui/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ExpensesPage from './components/dashboard/ExpensesPage';
import Reports from './components/dashboard/Reports';
import CategoryManager from './components/dashboard/CategoryManager';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <Router>
            <div className="App">
              <Navbar />
              <div className="app-content">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <div className="app-layout">
                        <Sidebar />
                        <div className="main-content">
                          <Dashboard />
                        </div>
                      </div>
                    </PrivateRoute>
                  } />
                  <Route path="/expenses" element={
                    <PrivateRoute>
                      <div className="app-layout">
                        <Sidebar />
                        <div className="main-content">
                          <ExpensesPage />
                        </div>
                      </div>
                    </PrivateRoute>
                  } />
                  <Route path="/reports" element={
                    <PrivateRoute>
                      <div className="app-layout">
                        <Sidebar />
                        <div className="main-content">
                          <Reports />
                        </div>
                      </div>
                    </PrivateRoute>
                  } />
                  <Route path="/categories" element={
                    <PrivateRoute>
                      <div className="app-layout">
                        <Sidebar />
                        <div className="main-content">
                          <CategoryManager />
                        </div>
                      </div>
                    </PrivateRoute>
                  } />
                </Routes>
              </div>
            </div>
          </Router>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;