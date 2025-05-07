import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../store/slices/productSlice';
import {
  getAllUsers,
  updateUser,
  deleteUser
} from '../../store/slices/userSlice';
import {
  getAllOrders,
  updateOrderStatus
} from '../../store/slices/orderSlice';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products = [], isLoading: productsLoading } = useSelector(
    (state) => state.product
  );
  const { users = [], isLoading: usersLoading } = useSelector(
    (state) => state.user
  );
  const { orders = [], isLoading: ordersLoading } = useSelector(
    (state) => state.order
  );

  const [activeTab, setActiveTab] = useState('overview');
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    images: []
  });

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllUsers());
    dispatch(getAllOrders());
  }, [dispatch]);

  // Calculate dashboard statistics
  const totalRevenue = Array.isArray(orders) ? orders.reduce(
    (sum, order) => sum + (order.isPaid ? order.totalPrice : 0),
    0
  ) : 0;
  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const totalProducts = Array.isArray(products) ? products.length : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const pendingOrders = Array.isArray(orders) ? orders.filter(
    (order) => order.status === 'pending'
  ).length : 0;

  const handleProductDialogOpen = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setProductFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        images: product.images
      });
    } else {
      setSelectedProduct(null);
      setProductFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        images: []
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setProductDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) || '' : value
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate numeric fields
      if (isNaN(productFormData.price) || isNaN(productFormData.stock)) {
        console.error('Price and stock must be valid numbers');
        return;
      }

      // Add the image URL to the images array
      const productData = {
        ...productFormData,
        images: ['https://www.tunisianet.com.tn/403274-large/pc-portable-lenovo-ideapad-1-15ijl7-celeron-n4500-8-go-256-go-ssd-gris.jpg']
      };

      console.log('Submitting product data:', productData);
      if (selectedProduct) {
        await dispatch(
          updateProduct({
            id: selectedProduct._id,
            productData
          })
        ).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      handleProductDialogClose();
    } catch (error) {
      console.error('Error submitting product:', error);
      // Error is handled by the product slice
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
      } catch (error) {
        // Error is handled by the product slice
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: orderId, status: newStatus })
      ).unwrap();
    } catch (error) {
      // Error is handled by the order slice
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await dispatch(
        updateUser({
          id: user._id,
          userData: { ...user, isActive: !user.isActive }
        })
      ).unwrap();
    } catch (error) {
      // Error is handled by the user slice
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        // Error is handled by the user slice
      }
    }
  };

  if (productsLoading || usersLoading || ordersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
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
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h5">
                      ${totalRevenue.toFixed(2)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h5">{totalOrders}</Typography>
                  </Box>
                  <ShoppingCartIcon color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Products
                    </Typography>
                    <Typography variant="h5">{totalProducts}</Typography>
                  </Box>
                  <ShoppingCartIcon color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h5">{totalUsers}</Typography>
                  </Box>
                  <PeopleIcon color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Button
            variant={activeTab === 'overview' ? 'contained' : 'text'}
            onClick={() => setActiveTab('overview')}
            sx={{ mr: 2 }}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'products' ? 'contained' : 'text'}
            onClick={() => setActiveTab('products')}
            sx={{ mr: 2 }}
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'contained' : 'text'}
            onClick={() => setActiveTab('orders')}
            sx={{ mr: 2 }}
          >
            Orders
          </Button>
          <Button
            variant={activeTab === 'users' ? 'contained' : 'text'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Button>
        </Box>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Paper elevation={3}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleProductDialogOpen()}
              >
                Add Product
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(products) && products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Product">
                          <IconButton
                            onClick={() => handleProductDialogOpen(product)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton
                            onClick={() => handleDeleteProduct(product._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(orders) && orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.user.name}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={
                            order.status === 'delivered'
                              ? 'success'
                              : order.status === 'cancelled'
                              ? 'error'
                              : 'primary'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order._id, e.target.value)
                            }
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(users) && users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Blocked'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip
                          title={user.isActive ? 'Block User' : 'Activate User'}
                        >
                          <IconButton
                            onClick={() => handleToggleUserStatus(user)}
                            size="small"
                            color={user.isActive ? 'error' : 'success'}
                          >
                            {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => handleDeleteUser(user._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Product Dialog */}
        <Dialog
          open={productDialogOpen}
          onClose={handleProductDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <form onSubmit={handleProductSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductFormChange}
                    required
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductFormChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={productFormData.price}
                    onChange={handleProductFormChange}
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    type="number"
                    value={productFormData.stock}
                    onChange={handleProductFormChange}
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={productFormData.category}
                    onChange={handleProductFormChange}
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    name="brand"
                    value={productFormData.brand}
                    onChange={handleProductFormChange}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleProductDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 