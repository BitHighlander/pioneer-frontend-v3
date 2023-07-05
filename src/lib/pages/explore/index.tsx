import React, { useEffect, useState } from 'react';
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
  VStack,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaUserPlus,
  FaInbox,
  FaMicrophone,
  FaHeadset,
  FaChevronDown,
} from "react-icons/fa";
import { Search2Icon, SettingsIcon, InfoIcon } from '@chakra-ui/icons';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { api, user, wallet, app } = state;
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdvancedViewOpen, setIsAdvancedViewOpen] = useState(false);
  const [pioneers, setPioneers] = useState({ charted: 0, discovered: 0 });
  const [assets, setAssets] = useState({ charted: 0, discovered: 0 });
  const [blockchains, setBlockchains] = useState({ charted: 0, discovered: 0 });
  const [nodes, setNodes] = useState({ charted: 0, discovered: 0 });
  const [dapps, setDapps] = useState({ charted: 0, discovered: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchNav, setShowSearchNav] = useState(false);
  const [searchResults, setSearchResults] = useState('');
  const [queryTimes, setQueryTimes] = useState([]);
  const [eventLog, setEventLog] = useState([]);
  const avatars = [
    { id: 1, src: "avatar1.png" },
    { id: 2, src: "avatar2.png" },
    // Add more avatars as needed
  ];
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setShowSearchNav(true)
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
          event = JSON.parse(event)
          if(event.height){
            // // @ts-ignore
            // setEventLog((prevLog) => [...prevLog, event]);
            let eventString = "event: " + event.network + " " + event.type + " " + event.height;
            console.log('eventString: ', eventString);
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
      <>
        <Header />
        {showSearchNav ? (
            <Box
                backgroundColor="gray.900"
                height="100vh"
                width="33%"
                position="fixed"
                top="0"
                left="0"
                padding="5"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
            >
              <VStack spacing={6} align="stretch">
                {avatars.map((avatar) => (
                    <Avatar
                        key={avatar.id}
                        name="User name"
                        src={avatar.src}
                        size="md"
                        showBorder={true}
                    />
                ))}
                <Button ref={btnRef} colorScheme="purple" onClick={onOpen}>
                  P
                </Button>
              </VStack>

              <VStack spacing={6} align="stretch">
                <IconButton
                    aria-label="Add friend"
                    icon={<FaUserPlus />}
                    size="lg"
                    variant="ghost"
                    colorScheme="purple"
                />

                <IconButton
                    aria-label="Inbox"
                    icon={<FaInbox />}
                    size="lg"
                    variant="ghost"
                    colorScheme="purple"
                />

                <IconButton
                    aria-label="Voice"
                    icon={<FaMicrophone />}
                    size="lg"
                    variant="ghost"
                    colorScheme="purple"
                />

                <IconButton
                    aria-label="Settings"
                    icon={<FaHeadset />}
                    size="lg"
                    variant="ghost"
                    colorScheme="purple"
                />
              </VStack>
            </Box>
        ) : (<div>
        </div>)}

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
                  <Icon
                      as={SettingsIcon}
                      w={5}
                      h={5}
                      onClick={() => setIsAdvancedViewOpen(!isAdvancedViewOpen)}
                      cursor="pointer"
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
