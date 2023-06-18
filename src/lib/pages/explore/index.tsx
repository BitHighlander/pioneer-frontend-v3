import { Box, Heading, Input, InputGroup, InputRightElement, Button, FormControl, Avatar, Icon, Text, Collapse, Flex, Tooltip } from '@chakra-ui/react';
import { Search2Icon, SettingsIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { Card, CardBody } from '@chakra-ui/react';
// @ts-ignore
import PIONEER from 'lib/assets/png/art.png';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false);

    const handleSearch = () => {
        // Put your search handling logic here.
        console.log(`Search term: ${searchTerm}`);
    };

    return (
        <>
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
                                        <Search2Icon />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Flex>
                        <Flex justifyContent="flex-end" mt={2}>
                            <Tooltip label="Advanced View" fontSize="md">
                                <Icon as={SettingsIcon} w={5} h={5} onClick={() => setIsAdvancedViewOpen(!isAdvancedViewOpen)} cursor="pointer" />
                            </Tooltip>
                        </Flex>
                    </Flex>
                </CardBody>
            </Card>
            <Collapse in={isAdvancedViewOpen}>
                <Card mt={4}>
                    <CardBody>
                        {/* Your charts and graphs go here */}
                        <Text>This is where your charts and graphs would be displayed.</Text>
                    </CardBody>
                </Card>
            </Collapse>
        </>
    );
};

const Pioneer = () => {
    return (
        <Box>
            <Header />
            <SearchBar />
        </Box>
    );
};

export default Pioneer;
