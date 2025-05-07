import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem
} from '@mui/material';
import { getProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
    dispatch(addToCart({ ...product, quantity }));
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

  if (!product) {
    return (
      <Container>
        <Alert severity="info" sx={{ my: 2 }}>
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box
                component="img"
                src={product.images[selectedImage]}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'contain',
                  mb: 2
                }}
              />
              <ImageList cols={4} rowHeight={100} sx={{ mt: 2 }}>
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #1976d2' : 'none'
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.averageRating}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({product.ratings.length} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Brand: {product.brand}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Category: {product.category}
              </Typography>
              <Typography
                variant="subtitle1"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : 'Out of Stock'}
              </Typography>
            </Box>

            {product.stock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 100, mr: 2 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={!user}
                >
                  Add to Cart
                </Button>
              </Box>
            )}

            {!user && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Please login to add items to your cart
              </Alert>
            )}
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Customer Reviews
          </Typography>
          {product.ratings.length > 0 ? (
            product.ratings.map((rating, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={rating.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {new Date(rating.date).toLocaleDateString()}
                  </Typography>
                </Box>
                {rating.review && (
                  <Typography variant="body1">{rating.review}</Typography>
                )}
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No reviews yet
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetails; 