const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductRating
} = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', auth, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', auth, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', auth, admin, deleteProduct);

// @route   POST /api/products/:id/ratings
// @desc    Add product rating
// @access  Private
router.post('/:id/ratings', auth, addProductRating);

module.exports = router; 