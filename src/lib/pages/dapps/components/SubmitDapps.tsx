import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Stack,
  CardBody,
  Card,
  Textarea,
  Select,
  CardFooter,
  Heading,
  Box,
  Text,
  VStack,
  Grid,
  theme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { Select as SelectImported, components } from 'chakra-react-select';
import { Steps, Step } from 'chakra-ui-steps';
import React, { useEffect, useState } from 'react';

import { protocols, features } from './Constants';

const SubmitDapps = () => {
  const [name, setName] = React.useState('');
  const [app, setApp] = React.useState('');
  const [image, setImage] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [minVersion, setMinVersion] = React.useState('');
  const [blockchains, setBlockchains] = React.useState([]);
  const [protocolsSupported, setProtocolsSupported] = React.useState([]);
  const [featuresSupported, setFeaturesSupported] = React.useState([]);
  const [isRest, setIsRest] = React.useState(false);
  const [blockchainsSupported, setBlockchainsSupported] = React.useState([]);
  const isError = false;
  const handleInputChangeName = (e: any) => setName(e.target.value);
  const handleInputChangeApp = (e: any) => setApp(e.target.value);
  const handleInputChangeImage = (e: any) => setImage(e.target.value);
  const handleInputChangeMinVersion = (e: any) => setMinVersion(e.target.value);
  const handleInputChangeDescription = (e: any) => setDescription(e.target.value);
  const handleSelectedBlockchains = async function (inputs: any) {
    try {
      console.log('input: onSelectedBlockchains: ', inputs);
      const blockchains: any = [];
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        blockchains.push(input.name);
      }
      setBlockchainsSupported(blockchains);
    } catch (e) {
      console.error(e);
    }
  };
  const handleSelectedProtocols = async function (input: any) {
    try {
      console.log('input: onSelectedProtocols: ', input);
      setProtocolsSupported(input);
      let isRestFound;
      for (let i = 0; i < input.length; i++) {
        const protocol = input[i];
        if (protocol.value === 'REST') {
          setIsRest(true);
          isRestFound = true;
        }
      }
      if (!isRestFound) {
        setIsRest(false);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleSelectedFeatures = async function (input: any) {
    try {
      console.log('input: onSelectedFeatures: ', input);
      setFeaturesSupported(input);
    } catch (e) {
      console.error(e);
    }
  };
  const [activeStep, setActiveStep] = React.useState(0);
  const onNext = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
  };

  const onBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const onSubmitStep = () => {
    // your submit logic...
    onSubmit();
  };
  const onSubmit = async function () {
    try {
      console.log('name: ', name);
      console.log('app: ', app);
      console.log('image: ', image);

      const dapp: any = {};
      dapp.name = name;
      dapp.app = app;
      dapp.homepage = app;
      dapp.tags = [...blockchainsSupported, ...protocols];
      dapp.image = image;
      dapp.minVersion = minVersion;
      dapp.description = description;
      dapp.protocols = protocolsSupported;
      dapp.blockchains = blockchainsSupported;
      dapp.features = featuresSupported;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Steps activeStep={0} colorScheme="teal" size="lg">
      <Step label="Basic Information">
        <Box padding={4}>
          <Box m={4}>
            <FormControl isInvalid={isError}>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={handleInputChangeName} />
              <FormHelperText>Enter the name of the app.</FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>App URL</FormLabel>
              <Input value={app} onChange={handleInputChangeApp} />
              <FormHelperText>Enter the URL of the dapp application</FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>Image URL</FormLabel>
              <Input value={image} onChange={handleInputChangeImage} />
              <FormHelperText>
                Enter the URL of image for the Dapp. this MUST be a valid URL, and not a encoding!
              </FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>Dapp Desription</FormLabel>
              <Textarea value={description} onChange={handleInputChangeDescription} />
              <FormHelperText>Enter a small description about the Dapp</FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>Minimum Version</FormLabel>
              <Input value={minVersion} onChange={handleInputChangeMinVersion} />
              <FormHelperText>Minimum version that the wallet must support</FormHelperText>
            </FormControl>
          </Box>
          <Button onClick={onNext}>Next</Button>
        </Box>
      </Step>
      <Step label="Technical Details">
        <Box padding={4}>
          {/* Technical Details */}
          <Box m={4}>
            <FormControl isInvalid={isError}>
              <FormLabel>Protocols Supported</FormLabel>
              <SelectImported
                isMulti
                name="protocols"
                options={protocols}
                placeholder="Wallet Connect... REST..."
                closeMenuOnSelect
                onChange={handleSelectedProtocols}
              />
              <FormHelperText>Enter all the protocols that the dapp supports.</FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>Features Supported</FormLabel>
              <SelectImported
                isMulti
                name="features"
                options={features}
                placeholder="basic-transfers... defi-earn..."
                closeMenuOnSelect
                onChange={handleSelectedFeatures}
              />
              <FormHelperText>Enter all the features that the dapp supports.</FormHelperText>
            </FormControl>
            <FormControl isInvalid={isError}>
              <FormLabel>Blockchains Supported</FormLabel>
              <SelectImported
                isMulti
                name="blockchains"
                options={blockchains}
                placeholder="ethereum... bitcoin... avalanche...."
                closeMenuOnSelect
                onChange={handleSelectedBlockchains}
              />
              <FormHelperText>Enter all the blockchains that the dapp supports.</FormHelperText>
            </FormControl>
          </Box>
          <Button onClick={onBack}>Back</Button>
          <Button onClick={onNext}>Next</Button>
        </Box>
      </Step>
      <Step label="Submit">
        <Box padding={4}>
          {/* Your form fields for Submit */}
          <Button mt={4} colorScheme="teal" type="submit" onClick={onSubmit}>
            Submit
          </Button>
          <Button onClick={onBack}>Back</Button>
          <Button onClick={onSubmitStep}>Submit</Button>
        </Box>
      </Step>
    </Steps>
  );
};

export default SubmitDapps;
