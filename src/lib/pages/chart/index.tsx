import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, IconButton, Flex, Avatar, CardHeader, CardFooter, Spinner, Text, Box, Heading, Button, Card, CardBody } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { usePioneer } from 'lib/context/Pioneer';
import prettyjson from 'prettyjson';
import { ArrowUpIcon, ArrowDownIcon, StarIcon } from '@chakra-ui/icons';

const Header = () => (
  <Box textAlign="center">
    <Heading>Chart</Heading>
    <br />
  </Box>
);

const Chart = () => {
  const { state } = usePioneer();
  const { api } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartType, setChartType] = useState('');
  const [completeness, setCompleteness] = useState('');
  const [dataObject, setDataObject] = useState(null);
  const [actions, setActions] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [corectness, setCorectness] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [missing, setMissing] = useState([]);

  const onChart = async function () {
    try {
      if (api) {
        // Get work to be done
        let task = await api.RandomCharting();
        task = task.data;
        console.log('task: ', task.entryType);
        setChartType(task.entryType);
        setCompleteness(task.analysis.completeness);
        setCorectness(task.analysis.correctness);
        setAccuracy(task.analysis.accuracy);
        setDataObject(task.data);
        setActions(task.analysis.actions);
        setAnalysis(task.analysis.analysis);
        setMissing(task.analysis.missing);
        // Select the kind of work you want to do

        // Get the next piece of work
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onStart = async function () {
    try {
      onChart();

      // Get work to be done

      // Select the kind of work you want to do

      // Get the next piece of work
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [api]);

  const handleSave = () => {
    // Handle save functionality here
  };

  if (!api) {
    return <Spinner size="xl" />;
  }

  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {dataObject ? (
        <div>
          <Box>
            <Header />
            <Card w="800px" justifyContent="left">
              <CardBody>
                <Box>
                  <Heading size="md">Chart</Heading>
                  <Text>
                    Review Discoveries and earn rewards
                    <Button onClick={onChart}>Generate New Task</Button>
                  </Text>
                </Box>
                {dataObject && (
                  <Box mt={4}>
                    <textarea
                      style={{
                        width: '100%',
                        height: '300px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        padding: '8px',
                      }}
                      value={JSON.stringify(dataObject, null, 2)}
                      onChange={(e) => setDataObject(JSON.parse(e.target.value))}
                    />
                    <Button colorScheme="green" mt={4} onClick={handleSave}>
                      Save
                    </Button>
                  </Box>
                )}
                <Card>
                  <CardHeader>
                    <Flex>
                      <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Avatar name="AI Assistant" src="" />

                        <Box>
                          <Heading size="sm">ChatGPT</Heading>
                          <Text>Pioneer, Pioneers.dev</Text>
                        </Box>
                      </Flex>
                      <IconButton variant="ghost" colorScheme="gray" aria-label="See menu" />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <p>
                      <Text>analysis: {analysis}</Text>
                    </p>
                    <p>
                      <Text>completeness: {completeness}</Text>
                    </p>
                    <p>
                      <Text>acc: {completeness}</Text>
                    </p>
                    <p>
                      <Text>acc: {actions}</Text>
                    </p>
                    <p>
                      <Text>missing: {missing}</Text>
                    </p>
                  </CardBody>
                  <CardFooter
                    justify="space-between"
                    flexWrap="wrap"
                    sx={{
                      '& > button': {
                        minW: '136px',
                      },
                    }}
                  ></CardFooter>
                </Card>
                <Box mt={4}>
                  <Button colorScheme="green" size="lg" mt={4}>
                    Done, Submit Entry to Pioneers
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </div>
      ) : (
        <div>
          <Spinner size="xl" />
        </div>
      )}
    </Box>
  );
};

export default Chart;
