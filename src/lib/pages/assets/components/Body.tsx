import React from "react";
import { Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const Body = () => {
    return (
        <Card>
            <CardBody>
                <Box>
                    <Tabs variant='enclosed' defaultIndex={1}>
                        <TabList>
                            <Tab>dApps pending review</Tab>
                            <Tab>Live for voting</Tab>
                            <Tab>Chart a new dapp</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <p>Content for dApps pending review!</p>
                            </TabPanel>
                            <TabPanel>
                                <p>Content for Live for voting!</p>
                            </TabPanel>
                            <TabPanel>
                                <p>Content for Chart a new dapp!</p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </CardBody>
        </Card>
    );
}

export default Body;
