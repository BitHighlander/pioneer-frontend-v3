import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';

import SubmitDapps from './SubmitDapps';
import WhitelistDapps from './WhitelistDapps';
import ReviewDapps from './ReviewDapps';

const Body = () => {
  return (
    <Card align="center" width="100%" size="lg">
      <CardBody overflowX="auto">
        <Tabs variant="enclosed" defaultIndex={0} isLazy align="center">
          <TabList>
            <Tab>Charted dApps</Tab>
            <Tab>dApps discovered</Tab>
            <Tab>Chart a new dApps</Tab>
          </TabList>
          <Box h="500px" overflowY="auto">
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
          </Box>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default Body;
