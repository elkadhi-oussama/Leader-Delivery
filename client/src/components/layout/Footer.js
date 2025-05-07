import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          {"© "}
          <Link color="inherit" href="/">
            Leader Delivery
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"All rights reserved."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 