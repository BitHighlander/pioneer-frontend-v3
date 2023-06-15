import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

import SubmitDapps from './SubmitDapps';

const Body = () => {
  return (
    <CardBody>
      <Box>
        <Tabs variant="enclosed" defaultIndex={0}>
          <TabList>
            <Tab>Chart a new dapp</Tab>
            <Tab>dApps pending review</Tab>
            <Tab>Live for voting</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SubmitDapps />
            </TabPanel>
            <TabPanel>
              <p>Content for dApps pending review!</p>
            </TabPanel>
            <TabPanel>
              <p>Content for Live for voting!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </CardBody>
  );
};

export default Body;
