import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
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
  TableRow
} from '@mui/material';
import { getUserOrders } from '../../store/slices/orderSlice';

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

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, isLoading, isError, message } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

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

  if (orders.length === 0) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Start shopping to see your orders here
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>

        {orders.map((order) => (
          <Paper key={order._id} elevation={3} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              {/* Order Header */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h6">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Typography>
                  <Box>
                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
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
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price}</TableCell>
                          <TableCell align="right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Order Details */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                      <br />
                      {order.shippingAddress.country}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {order.paymentMethod.replace('_', ' ')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                      Order Total
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${order.totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Orders; 