import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import WhitelistNodes from './components/Nodes';
const Header = () => (
  <Box p={5}>
    <Heading>Nodes</Heading>
    <br />
    <Button colorScheme="blue" size="md">
      Add a node
    </Button>
  </Box>
);

const Nodes = () => {
  return (
    <Box>
      <Header></Header>
      <Tabs variant="enclosed" defaultIndex={0}>
        <TabList>
          <Tab>Nodes Charted</Tab>
          <Tab>Chart a new Nodes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WhitelistNodes />
          </TabPanel>
          <TabPanel>
            <p>Chart a Nodes!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Nodes;
