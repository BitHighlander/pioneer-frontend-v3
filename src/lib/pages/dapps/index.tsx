import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

import Body from './components/Body';

const Header = () => (
  <Box p={5}>
    <Heading>Exploring Dapps</Heading>
  </Box>
);

const Dapps = () => {
  return (
    <div>
      <Card>
        <Header />
        <Body />
      </Card>
    </div>
  );
};

export default Dapps;
