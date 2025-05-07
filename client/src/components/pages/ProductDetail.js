import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  Rating,
  Divider,
  Paper
} from '@mui/material';
import { getProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product?.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: id, quantity }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.default'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.numReviews} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
            {product.stock > 0 && (
              <Typography variant="body2" color="text.secondary">
                {product.stock} units available
              </Typography>
            )}
          </Box>

          {product.stock > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: '100px', mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAddToCart}
                fullWidth
              >
                Add to Cart
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Brand
                </Typography>
                <Typography variant="body1">{product.brand}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1">{product.category}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 