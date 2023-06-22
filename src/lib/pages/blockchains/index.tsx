import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import WhitelistBlockchains from './components/Blockchains';
import SubmitBlockchains from './components/Blockchains';

const Header = () => (
  <Box p={5}>
    <Heading>Blockchains</Heading>
    <br />
  </Box>
);

const Blockchains = () => {
  return (
    <Box>
      <Header></Header>
      <Tabs variant="enclosed" defaultIndex={0}>
        <TabList>
          <Tab>Blockchain Charted</Tab>
          <Tab>Chart a new Blockchain</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WhitelistBlockchains />
          </TabPanel>
          <TabPanel>
            <SubmitBlockchains/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Blockchains;
