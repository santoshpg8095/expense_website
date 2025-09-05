const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all expenses for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    
    let filter = { user: req.user._id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Expense.countDocuments(filter);
    
    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get expense by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create new expense
router.post('/', [
  auth,
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, category, date } = req.body;
    
    const expense = new Expense({
      amount,
      description,
      category,
      date,
      user: req.user._id
    });
    
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update expense
router.put('/:id', [
  auth,
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('description').optional().notEmpty().withMessage('Description is required'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    const { amount, description, category, date } = req.body;
    
    if (amount !== undefined) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    
    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get expenses summary
router.get('/summary/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let match = { user: req.user._id };
    
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }
    
    const stats = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          averageExpense: { $avg: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const categoryStats = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.json({
      overall: stats[0] || { totalExpenses: 0, averageExpense: 0, count: 0 },
      byCategory: categoryStats
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;