const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', auth, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, admin, updateOrderStatus);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', auth, admin, getAllOrders);

module.exports = router; 