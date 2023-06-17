import { Box, Heading, Button } from '@chakra-ui/react';
import React from 'react';

import Leaderboard from './components/Leaderboard';

const Header = () => (
  <Box p={5}>
    <Heading>Top Pioneers</Heading>
    <br />
  </Box>
);

const Pioneers = () => {
  return (
    <Box>
      <Header />
        <Leaderboard/>
    </Box>
  );
};

export default Pioneers;
