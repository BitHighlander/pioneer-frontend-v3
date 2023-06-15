import { Box, Heading, Button, VStack, Card, CardBody } from '@chakra-ui/react';
import React from 'react';
import type { To } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleButtonClick = (route: To) => {
    navigate(route);
  };

  return (
    <Card>
      <CardBody>
        <Box p={5}>
          <Heading mb={4}>Pioneers.dev</Heading>
          <VStack spacing={4} alignItems="start">
            <Box>
              <Button
                colorScheme="blue"
                size="md"
                onClick={() =>
                  window.open('https://nouns.build/dao/0x25EF864904d67e912B9eC491598A7E5A066B102F', '_blank')
                }
              >
                Become a Pioneer
              </Button>
            </Box>
            <Box>
              <Button colorScheme="green" size="sm" onClick={() => handleButtonClick('/dapps')}>
                Explore
              </Button>
            </Box>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Header;
