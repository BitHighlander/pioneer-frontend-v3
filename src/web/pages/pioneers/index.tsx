import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import React from 'react';

import Leaderboard from './components/Leaderboard';
import Quests from './components/Quests';

const Header = () => (
  <Box textAlign="center">
    <Heading>Top Pioneers</Heading>
    <br />
  </Box>
);

const Pioneers = () => {
  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Header />
        <Tabs>
          <TabList justifyContent="center">
            <Tab>Leaderboard</Tab>
            <Tab>Your Quests</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Leaderboard />
            </TabPanel>
            <TabPanel>
              <Quests />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Pioneers;
