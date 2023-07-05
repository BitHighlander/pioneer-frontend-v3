import React, { useState, useEffect } from 'react';
import {
    CardHeader,
    CardFooter,
    List,
    ListItem,
    ListIcon,
    Box,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    FormControl,
    Avatar,
    Icon,
    Text,
    Collapse,
    Flex,
    Tooltip,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Card,
    CardBody,
    SimpleGrid,
} from '@chakra-ui/react';
// @ts-ignore
import PIONEER from 'lib/assets/png/art.png';
import { usePioneer } from 'lib/context/Pioneer';

const AdvancedTab = () => {
    const { state } = usePioneer();
    const { api, user, wallet, app } = state;
    const [eventLog, setEventLog] = useState([]);
    const [pioneers, setPioneers] = useState(0);
    const [assets, setAssets] = useState({ charted: 0, discovered: 0 });
    const [blockchains, setBlockchains] = useState({ charted: 0, discovered: 0 });
    const [nodes, setNodes] = useState({ charted: 0, discovered: 0 });
    const [dapps, setDapps] = useState({ charted: 0, discovered: 0 });
    
    const onStart = async () => {
        try {
            if (api && app) {
                const globals = await api.Globals();
                console.log(globals.data);
                setPioneers(globals.data.info.users);
                // setAssets(globals.data.info.assets);
                // setBlockchains(globals.data.info.blockchains);
                // setNodes(globals.data.info.nodes);
                // setDapps(globals.data.info.dapps);

                let events = await app.startSocket();
                console.log('events: ', events);

                events.on('message', (event) => {
                    // console.log('message: ', event);
                    event = JSON.parse(event)
                    if(event.height){
                        // // @ts-ignore
                        // setEventLog((prevLog) => [...prevLog, event]);
                        let eventString = "event: " + event.network + " " + event.type + " " + event.height;
                        //console.log('eventString: ', eventString);
                        // @ts-ignore
                        setEventLog((prevLog) => [...prevLog, eventString]);
                    }

                });

                events.on('blocks', (event:any) => {
                    //console.log('blocks: ', event);

                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        onStart();
    }, [api, app]);

    return (
        <Box p={4}>
            <Heading mb={4}>Advanced</Heading>
            <SimpleGrid columns={2} spacing={4}>
                <Box>
                    <Text mb={2} fontWeight="bold">Event Log:</Text>
                    {eventLog.map((event, index) => (
                        <Text key={index}>{JSON.stringify(event)}</Text>
                    ))}
                </Box>
                <Box>
                    <Card mt={4}>
                        <Flex>
                            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                                <Card>
                                    <CardHeader>
                                        <Heading size="md">Pioneer Tracking</Heading>
                                        <Text>Pioneers: {pioneers}</Text>
                                    </CardHeader>
                                    <CardBody>
                                        <Table variant="simple" size="sm" mt={4}>
                                            <Thead>
                                                <Tr>
                                                    <Th>Category</Th>
                                                    <Th>Charted</Th>
                                                    <Th>Discovered</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                <Tr>
                                                    <Td>Assets</Td>
                                                    <Td>{assets.charted}</Td>
                                                    <Td>{assets.discovered}</Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>Blockchains</Td>
                                                    <Td>{blockchains.charted}</Td>
                                                    <Td>{blockchains.discovered}</Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>Nodes</Td>
                                                    <Td>{nodes.charted}</Td>
                                                    <Td>{nodes.discovered}</Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>Dapps</Td>
                                                    <Td>{dapps.charted}</Td>
                                                    <Td>{dapps.discovered}</Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </CardBody>
                                    <CardFooter>
                                        <Button>View here</Button>
                                    </CardFooter>
                                </Card>
                            </SimpleGrid>
                        </Flex>
                    </Card>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default AdvancedTab;
