import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

import SubmitDapps from './SubmitDapps';
import WhitelistDapps from './WhitelistDapps';
import ReviewDapps from './ReviewDapps';

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
              <WhitelistDapps></WhitelistDapps>
            </TabPanel>
            <TabPanel>
              <ReviewDapps></ReviewDapps>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </CardBody>
  );
};

export default Body;
