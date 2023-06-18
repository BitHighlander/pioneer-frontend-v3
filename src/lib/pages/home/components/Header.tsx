import { Flex, Img, Box, Heading, Button, VStack, Card, CardBody, Text } from '@chakra-ui/react';
import React from 'react';
import type { To } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import PIONEER from 'lib/assets/png/art.png';


const Header = () => {
  const navigate = useNavigate();

  const handleButtonClick = (route: To) => {
    navigate(route);
  };

  return (
      <Card>
        <CardBody>
          <Flex alignItems="start" justifyContent="space-between">
            <Box p={5}>
              <Heading mb={4}>Pioneers.dev</Heading>
              <Text as='cite' fontSize="md" mb={4}>"Pioneer is a human assisted AI project designed to chart and track the fast moving blockchain space"</Text>
              <br/>
              <VStack spacing={4} alignItems="start">
                <Box>
                  <br/>
                  <Button
                      colorScheme="green"
                      size="lg"
                      onClick={() => handleButtonClick('/explore')}
                  >
                    <SearchIcon></SearchIcon>Explore
                  </Button>
                </Box>
                <br/>
                <Box>
                  <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() =>
                          window.open(
                              'https://nouns.build/dao/0x25EF864904d67e912B9eC491598A7E5A066B102F',
                              '_blank'
                          )
                      }
                  >
                    Become a Pioneer
                  </Button>
                </Box>
              </VStack>
            </Box>
            <Img src={PIONEER} title="Chakra UI" height={500} width={500} />
          </Flex>
        </CardBody>
      </Card>
  );
};

export default Header;
