import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { getProducts } from '../../store/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { products = [], isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          px: 4,
          borderRadius: 2,
          mb: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Leader Delivery
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Discover amazing products at great prices
        </Typography>
        <Button
          component={RouterLink}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products */}
      <Typography variant="h4" component="h2" gutterBottom>
        Featured Products
      </Typography>
      <Grid container spacing={4}>
        {Array.isArray(products) &&
          products.slice(0, 4).map((product) => (
            <Grid key={product._id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "contain", p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description.substring(0, 100)}...
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/product/${product._id}`}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Categories Section */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography
          component="h2"
          variant="h4"
          color="text.primary"
          gutterBottom
        >
          Shop by Category
        </Typography>
        <Grid container spacing={2}>
          {["electronics", "clothing", "books", "home"].map((category) => (
            <Grid key={category} xs={6} sm={3}>
              <Card
                component={RouterLink}
                to={`/products?category=${category}`}
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 