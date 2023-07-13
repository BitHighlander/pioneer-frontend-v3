import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import WhitelistNodes from './components/Nodes';
import ChartNode from './components/ChartNode';
const Header = () => (
  <Box textAlign="center">
    <Heading>Nodes</Heading>
    <br />
  </Box>
);

const Nodes = () => {
  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Header></Header>
        <Tabs>
          <TabList justifyContent="center">
            <Tab>Charted</Tab>
            <Tab>Discovered</Tab>
            <Tab>Submit a new Node</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <WhitelistNodes />
            </TabPanel>
            <TabPanel>
              <WhitelistNodes />
            </TabPanel>
            <TabPanel>
              <ChartNode />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Nodes;
