import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { getOrder, updateOrderStatus } from '../../store/slices/orderSlice';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const OrderManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order, isLoading, isError, message } = useSelector(
    (state) => state.order
  );

  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
      setStatus(newStatus);
    } catch (error) {
      // Error is handled by the order slice
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 2 }}>
          {message}
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Alert severity="info" sx={{ my: 2 }}>
          Order not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant="h4" component="h1">
            Order #{order._id.slice(-6).toUpperCase()}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Order Status */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6">Order Status</Typography>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Order Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography variant="body1">
                Name: {order.user.name}
              </Typography>
              <Typography variant="body1">
                Email: {order.user.email}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.street}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress.country}
              </Typography>
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.product._id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() =>
                              navigate(`/product/${item.product._id}`)
                            }
                          >
                            <Box
                              component="img"
                              src={item.product.images[0]}
                              alt={item.product.name}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                mr: 2
                              }}
                            />
                            <Typography variant="body2">
                              {item.product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">${item.price}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography variant="h6">Order Total:</Typography>
                <Typography variant="h5" color="primary">
                  ${order.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order Date: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment Method: {order.paymentMethod.replace('_', ' ')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderManagement; 