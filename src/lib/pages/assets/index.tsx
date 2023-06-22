import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import WhitelistAssets from './components/Assets';
const Header = () => (
  <Box p={5}>
    <Heading>Assets</Heading>
  </Box>
);

const Assets = () => {
  return (
    <Box>
      <Header />
      <Tabs variant="enclosed" defaultIndex={0}>
        <TabList>
          <Tab>Assets Charted</Tab>
          <Tab>Chart a new Assets</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WhitelistAssets />
          </TabPanel>
          <TabPanel>
            <p>Chart a Assets!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Assets;
