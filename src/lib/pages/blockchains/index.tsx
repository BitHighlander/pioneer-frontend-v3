import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React from 'react';
import DiscoverdBlockchains from './components/BlockchainsDiscovered';
import ChartedBlockchains from './components/Blockchains';
import SubmitBlockchains from './components/ChartBlockchain';

const Header = () => (
    <Box textAlign="center">
        <Heading>Blockchains</Heading>
        <br />
    </Box>
);

const Blockchains = () => {
    return (
        <Box display="flex" justifyContent="center" height="100vh">
            <Box>
                <Header />
                <Tabs>
                    <TabList justifyContent="center">
                        <Tab>Charted</Tab>
                        <Tab>Discovered</Tab>
                        <Tab>Submit a new Blockchain</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <ChartedBlockchains />
                        </TabPanel>
                        <TabPanel>
                            <DiscoverdBlockchains />
                        </TabPanel>
                        <TabPanel>
                            <SubmitBlockchains />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
};

export default Blockchains;
