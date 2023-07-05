import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Collapse,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Avatar,
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
    Heading,
    Text,
    SimpleGrid,
    CardHeader,
    CardFooter,
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react';
import { Search2Icon, SettingsIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
// @ts-ignore
import PIONEER from 'lib/assets/png/art.png';
import { usePioneer } from 'lib/context/Pioneer';

const Header = () => (
    <Card>
        <CardBody>
            <Box p={5}>
                <Heading mb={4}>Explore</Heading>
            </Box>
        </CardBody>
    </Card>
);

const SearchBar = () => {
    const { state } = usePioneer();
    const { api, user, wallet, app } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false);
    const [isLeftNavOpen, setIsLeftNavOpen] = useState(true);
    const [pioneers, setPioneers] = useState({ charted: 0, discovered: 0 });
    const [assets, setAssets] = useState({ charted: 0, discovered: 0 });
    const [blockchains, setBlockchains] = useState({ charted: 0, discovered: 0 });
    const [nodes, setNodes] = useState({ charted: 0, discovered: 0 });
    const [dapps, setDapps] = useState({ charted: 0, discovered: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState('');
    const [queryTimes, setQueryTimes] = useState([]);
    const [eventLog, setEventLog] = useState([]);

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            setIsLeftNavOpen(true);
            const start = Date.now();
            const results = await api.Query({ query: searchTerm });
            const end = Date.now();
            const timeTaken = end - start;
            console.log('results', results);
            console.log('results', results.data);
            console.log('results', results.data.response.text);
            setSearchResults(results.data.response.text);
            setIsLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    const onStart = async () => {
        try {
            if (api && app) {
                const globals = await api.Globals();
                console.log(globals.data);
                setPioneers(globals.data.info.users);
                setAssets(globals.data.info.assets);
                setBlockchains(globals.data.info.blockchains);
                setNodes(globals.data.info.nodes);
                setDapps(globals.data.info.dapps);

                let events = await app.startSocket();
                console.log('events: ', events);

                events.on('message', (event) => {
                    console.log('message: ', event);
                    event = JSON.parse(event);
                    if (event.height) {
                        let eventString = "event: " + event.network + " " + event.type + " " + event.height;
                        console.log('eventString: ', eventString);
                        // @ts-ignore
                        setEventLog((prevLog) => [...prevLog, eventString]);
                    }
                });

                events.on('blocks', (event: any) => {
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
        <Grid templateColumns="250px 1fr" gap={4}>
            <Collapse in={isLeftNavOpen} animateOpacity>
                <GridItem>
                    <Card h="calc(100vh - 32px)" p={2}>
                        <Flex direction="column" h="100%">
                            <Tooltip label="Collapse" fontSize="md">
                                <IconButton
                                    icon={<ChevronLeftIcon />}
                                    aria-label="Collapse"
                                    size="md"
                                    onClick={() => setIsLeftNavOpen(false)}
                                    mb={2}
                                />
                            </Tooltip>
                            {/* Add left-hand navigation content here */}
                            <Text>Left Hand Navigation</Text>
                        </Flex>
                    </Card>
                </GridItem>
            </Collapse>
            <GridItem colSpan={isLeftNavOpen ? 1 : 2}>
                <Card>
                    <CardBody>
                        <Flex direction="row">
                            <Collapse in={isLeftNavOpen} animateOpacity>
                                <GridItem>
                                    <Tooltip label="Expand" fontSize="md">
                                        <IconButton
                                            icon={<ChevronRightIcon />}
                                            aria-label="Expand"
                                            size="md"
                                            onClick={() => setIsLeftNavOpen(true)}
                                            mt={4}
                                        />
                                    </Tooltip>
                                </GridItem>
                            </Collapse>
                            <Flex direction="column" p={6} borderRadius="2xl">
                                <Flex alignItems="center">
                                    <Avatar src={PIONEER} name="Blockchain explorer" size="xl" mr={6} />
                                    <InputGroup size="lg" flex="1">
                                        <Input
                                            pr="4.5rem"
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            placeholder="Search blockchain worlds..."
                                            borderRadius="2xl"
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button h="1.75rem" size="sm" colorScheme="blue" variant="outline" onClick={handleSearch}>
                                                {isLoading ? <Spinner /> : <Search2Icon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </Flex>
                                <Flex justifyContent="flex-end" mt={2}>
                                    <Tooltip label="Advanced View" fontSize="md">
                                        <IconButton
                                            icon={<SettingsIcon />}
                                            aria-label="Advanced View"
                                            size="md"
                                            onClick={() => setIsAdvancedViewOpen(!isAdvancedViewOpen)}
                                            colorScheme={isAdvancedViewOpen ? 'blue' : 'gray'}
                                        />
                                    </Tooltip>
                                </Flex>
                                {searchResults && (
                                    <Card>
                                        <Flex>
                                            <Card>{searchResults}</Card>
                                        </Flex>
                                    </Card>
                                )}
                            </Flex>
                        </Flex>
                    </CardBody>
                </Card>
                <Collapse in={isAdvancedViewOpen}>
                    <Card mt={4}>
                        <Flex>
                            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                                <Card>
                                    <CardHeader>
                                        <Heading size="md">Pioneer Tracking</Heading>
                                        <Text>Pioneers: {pioneers.charted}</Text>
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
                    <Card>
                        <Card p={4} borderWidth="1px" borderColor="gray.400" borderRadius="md" maxH="200px" overflowY="auto">
                            <Heading size="sm" mb={2}>
                                Events
                            </Heading>
                            <List spacing={2}>
                                {eventLog.map((event, index) => {
                                    return (
                                        <ListItem key={index}>
                                            <ListIcon as={InfoIcon} color="blue.500" />
                                            Event: {event}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Card>
                    </Card>
                </Collapse>
            </GridItem>
        </Grid>
    );
};

const Pioneer = () => {
    return (
        <Box>
            <SearchBar />
        </Box>
    );
};

export default Pioneer;
