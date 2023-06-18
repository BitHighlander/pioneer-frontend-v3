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
            <Tab>Charted dApps</Tab>
            <Tab>dApps discoverd</Tab>
            <Tab>Chart a new dApps</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ReviewDapps></ReviewDapps>
            </TabPanel>
            <TabPanel>
              <WhitelistDapps></WhitelistDapps>
            </TabPanel>
            <TabPanel>
              <SubmitDapps />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </CardBody>
  );
};

export default Body;
