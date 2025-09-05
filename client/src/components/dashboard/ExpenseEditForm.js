import React from 'react';
import ExpenseForm from './ExpenseForm';

const ExpenseEditForm = ({ expense, onSuccess, onCancel }) => {
  return (
    <div>
      <ExpenseForm 
        expense={expense}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ExpenseEditForm;