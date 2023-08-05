import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import SubmitDapps from './components/SubmitDapps';
import ChartDapps from './components/ChartDapps';
import ReviewDapps from './components/ReviewDapps';
import { useParams } from "react-router-dom";
const Header = () => (
  <Box textAlign="center">
    <Heading>Exploring Dapps</Heading>
    <br />
  </Box>
);

const Dapps = () => {
  const { search, showUncharted, filterByBlockchain } = useParams<{
    search?: string;
    showUncharted?: string; // Use string since it can be 'true' or 'false' in the URL
    filterByBlockchain?: string;
  }>();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  
  let onStart = async function(){
    setActiveTabIndex(0);
  }
  //onstart get data
  useEffect(() => {
    onStart();
  }, []);
  
  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Header />
        <Tabs variant="enclosed" defaultIndex={0} isLazy align="center">
          <TabList>
            <Tab>Dapps</Tab>
            {/*<Tab>Discovered</Tab>*/}
            <Tab>Submit a new dApp</Tab>
          </TabList>
          <Box h="500px" overflowY="auto">
            <TabPanels>
              <TabPanel>
                <ReviewDapps></ReviewDapps>
              </TabPanel>
              {/*<TabPanel>*/}
              {/*  <ChartDapps></ChartDapps>*/}
              {/*</TabPanel>*/}
              <TabPanel>
                <SubmitDapps onTabChange={handleTabChange}/>
              </TabPanel>
            </TabPanels>
          </Box>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Dapps;
