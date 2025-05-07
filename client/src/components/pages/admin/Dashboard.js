import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../store/slices/productSlice';
import { getAllOrders, updateOrderStatus } from '../../../store/slices/orderSlice';
import { getUsers, deleteUser } from '../../../store/slices/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, isLoading: productsLoading } = useSelector((state) => state.product);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { users, isLoading: usersLoading } = useSelector((state) => state.user);

  const [productDialog, setProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    image: ''
  });

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getAllOrders());
    dispatch(getUsers());
  }, [dispatch]);

  const handleProductDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        countInStock: product.countInStock,
        image: product.image
      });
    } else {
      setSelectedProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: ''
      });
    }
    setProductDialog(true);
  };

  const handleProductSubmit = () => {
    if (selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct._id, ...productForm }));
    } else {
      dispatch(createProduct(productForm));
    }
    setProductDialog(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  if (productsLoading || ordersLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{products.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{orders.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">
                ${orders.reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Products Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Products</Typography>
            <Button variant="contained" onClick={() => handleProductDialog()}>
              Add Product
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.countInStock}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleProductDialog(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteProduct(product._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Orders Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Orders</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Users Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>Users</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteUser(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Product Dialog */}
      <Dialog open={productDialog} onClose={() => setProductDialog(false)}>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={productForm.countInStock}
              onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialog(false)}>Cancel</Button>
          <Button onClick={handleProductSubmit} variant="contained">
            {selectedProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 