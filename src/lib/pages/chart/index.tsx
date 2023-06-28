import { Spinner, Text, Box, Heading, Button, Card, CardBody, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { usePioneer } from 'lib/context/Pioneer';

const Header = () => (
    <Box textAlign="center">
        <Heading>Chart</Heading>
        <br />
    </Box>
);

const Chart = () => {
    const { state } = usePioneer();
    const { api } = state;

    let onStart = async function(){
        try{
            //get work to be done
            
            //select kind of work you want to do
            
            //get next piece of work
        }catch(e){
            console.error(e)
        }
    }

    useEffect(() => {
        onStart();
    }, [api]);

    if (!api) {
        return <Spinner size="xl" />;
    }

    return (
        <Box display="flex" justifyContent="center" height="100vh">
            <Box>
                <Header></Header>
                <Card w="800px" justifyContent="left">
                    <CardBody>
                        Rewview Discoverys and earn rewards
                        <div>
                            <Text>

                            </Text>
                        </div>
                    </CardBody>
                </Card>
            </Box>
        </Box>
    );
};

export default Chart;
