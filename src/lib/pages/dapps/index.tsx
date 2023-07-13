import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

import SubmitDapps from './components/SubmitDapps';
import ChartDapps from './components/ChartDapps';
import ReviewDapps from './components/ReviewDapps';
const Header = () => (
  <Box textAlign="center">
    <Heading>Exploring Dapps</Heading>
    <br />
  </Box>
);

const Dapps = () => {
  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Header />
        <Tabs variant="enclosed" defaultIndex={0} isLazy align="center">
          <TabList>
            <Tab>Charted</Tab>
            <Tab>Discovered</Tab>
            <Tab>Submit a new dApp</Tab>
          </TabList>
          <Box h="500px" overflowY="auto">
            <TabPanels>
              <TabPanel>
                <ReviewDapps></ReviewDapps>
              </TabPanel>
              <TabPanel>
                <ChartDapps></ChartDapps>
              </TabPanel>
              <TabPanel>
                <SubmitDapps />
              </TabPanel>
            </TabPanels>
          </Box>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Dapps;
