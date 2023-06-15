import { Box, Heading, Button } from '@chakra-ui/react';
import React from 'react';

const Header = () => (
  <Box p={5}>
    <Heading>Blockchains</Heading>
    <br />
    <Button colorScheme="blue" size="md">
      Chart a Blockchain
    </Button>
  </Box>
);

const Blockchains = () => {
  return (
    <Box>
      <Header />
    </Box>
  );
};

export default Blockchains;
