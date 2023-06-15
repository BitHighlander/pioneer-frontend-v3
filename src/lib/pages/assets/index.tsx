import { Box, Heading, Button } from '@chakra-ui/react';
import React from 'react';

const Header = () => (
  <Box p={5}>
    <Heading>Assets</Heading>
    <br />
    <Button colorScheme="blue" size="md">
      Chart an Asset
    </Button>
  </Box>
);

const Assets = () => {
  return (
    <Box>
      <Header />
    </Box>
  );
};

export default Assets;
