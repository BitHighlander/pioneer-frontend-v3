import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Flex,
  Avatar,
  Spinner,
  Text,
  VStack,
  List,
  ListItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import PIONEER from 'lib/assets/png/art.png';

const SearchTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data
      const mockResults = [
        { id: 1, title: 'Result 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, title: 'Result 2', description: 'Pellentesque euismod dolor non vestibulum condimentum.' },
        { id: 3, title: 'Result 3', description: 'Nulla consectetur mauris in aliquam pharetra.' },
      ];

      setSearchResults(mockResults);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResultClick = (result) => {
    setSelectedResult(result);
  };

  return (
      <Flex p={4}>
        <Box w="30%">
          <VStack align="stretch" spacing={4}>
            <Flex alignItems="center" mb={4}>
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
                    {isLoading ? <Spinner /> : <SearchIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>

            <List spacing={2}>
              {searchResults.map((result) => (
                  <ListItem
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      p={2}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: 'gray.200' }}
                  >
                    {result.title}
                  </ListItem>
              ))}
            </List>
          </VStack>
        </Box>

        <Box flex="1" ml={4}>
          {selectedResult ? (
              <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md" height="100%">
                <Heading as="h4" size="md" mb={2}>
                  {selectedResult.title}
                </Heading>
                <Text>{selectedResult.description}</Text>
              </Box>
          ) : (
              <Box flex="1" borderWidth="1px" borderRadius="md" boxShadow="md" p={4}>
                <Text>Select a result to display details</Text>
              </Box>
          )}
        </Box>
      </Flex>
  );
};

export default SearchTab;
