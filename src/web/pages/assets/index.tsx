import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import AssetsList from './components/AssetList';
import AssetsDiscovered from './components/AssetsDiscovered';
import SubmitAssets from './components/ChartAsset';
const Header = () => (
  <Box textAlign="center">
    <Heading>Assets</Heading>
    <br />
  </Box>
);

const Assets = () => {
  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Header />
        <Tabs>
          <TabList justifyContent="center">
            <Tab>Charted</Tab>
            <Tab>Discovered</Tab>
            <Tab>Submit a new Assets</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AssetsList />
            </TabPanel>
            <TabPanel>{/*<AssetsList />*/}</TabPanel>
            <TabPanel>
              <SubmitAssets />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Assets;
