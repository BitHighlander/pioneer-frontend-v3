import { List, ListItem, ListIcon, Box, Heading, Input, InputGroup, InputRightElement, Button, FormControl, Avatar, Icon, Text, Collapse, Flex, Tooltip, Spinner } from '@chakra-ui/react';
import { Search2Icon, SettingsIcon, InfoIcon, SmallAddIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@chakra-ui/react';
// @ts-ignore
import PIONEER from 'lib/assets/png/art.png';
import { usePioneer } from "lib/context/Pioneer";

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
    const { api, user, wallet } = state;
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false);
    const [pioneers, setPioneers] = useState(0)
    const [assets, setAssets] = useState(0)
    const [blockchains, setBlockchains] = useState(0)
    const [nodes, setNodes] = useState(0)
    const [dapps, setDapps] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState("");
    const [queryTimes, setQueryTimes] = useState([]);

    const handleSearch = async () => {
        try{
            setIsLoading(true);
            let start = Date.now();
            let results = await api.Query({ query: searchTerm });
            let end = Date.now();
            let timeTaken = end - start;
            console.log("results",results)
            console.log("results",results.data)
            console.log("results",results.data.response.text)
            // setSearchResults(results.data.response)
            // @ts-ignore
            // setQueryTimes([...queryTimes, timeTaken]);
            setSearchResults(results.data.response.text);
            setIsLoading(false);
        }catch(e){
            console.error(e)
        }
    };

    const onStart = async () => {
        try{
            if(api){
                let globals = await api.Globals()
                console.log(globals.data)
                setPioneers(globals.data.info.users)
                setAssets(globals.data.info.assets)
                setBlockchains(globals.data.info.blockchains)
                setNodes(globals.data.info.nodes)
                setDapps(globals.data.info.dapps)
            }
        }catch(e){
            console.error(e)
        }
    };

    useEffect(() => {
        onStart();
    }, [api]); // Run onStart only once on component mount

    return (
        <>
            <Header />
            <Card>
                <CardBody>
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
                                <Icon as={SettingsIcon} w={5} h={5} onClick={() => setIsAdvancedViewOpen(!isAdvancedViewOpen)} cursor="pointer" />
                            </Tooltip>
                        </Flex>
                        {/* Search Results */}
                        {searchResults && (
                            <Card>
                                <Flex>
                                    {/* Render search results here */}
                                    <Card>{searchResults}</Card>
                                </Flex>
                            </Card>
                        )}
                    </Flex>
                </CardBody>
            </Card>
            <Collapse in={isAdvancedViewOpen}>
                <Card mt={4}>
                    <CardBody>
                        {/* Global info here */}
                        <Card mt={4}>
                            <CardBody>
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={InfoIcon} color='green.500' />
                                        Pioneers: {pioneers}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={SmallAddIcon} color='green.500' />
                                        Assets: {assets}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={SmallAddIcon} color='green.500' />
                                        Blockchains: {blockchains}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={SmallAddIcon} color='green.500' />
                                        Nodes: {nodes}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={SmallAddIcon} color='green.500' />
                                        Dapps: {dapps}
                                    </ListItem>
                                    {/* Query Times */}
                                    {queryTimes.map((time, index) => (
                                        <ListItem key={index}>
                                            <Text>Query {index + 1}: {time}ms</Text>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </Collapse>
        </>
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
