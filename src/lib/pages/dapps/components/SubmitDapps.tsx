import { FormControl, FormLabel, FormHelperText, Input, Button, Box } from '@chakra-ui/react';
import { Steps, Step } from 'chakra-ui-steps';
import React, { useState } from 'react';
import Select from 'react-select';

import { protocols, features } from './Constants';

const SubmitDapps = () => {
    const [name, setName] = useState('');
    const [app, setApp] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [minVersion, setMinVersion] = useState('');
    const [blockchainsSupported, setBlockchainsSupported] = useState([]);
    const [protocolsSupported, setProtocolsSupported] = useState([]);
    const [featuresSupported, setFeaturesSupported] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    const handleInputChangeName = (e) => setName(e.target.value);
    const handleInputChangeApp = (e) => setApp(e.target.value);
    const handleInputChangeImage = (e) => setImage(e.target.value);
    const handleInputChangeMinVersion = (e) => setMinVersion(e.target.value);
    const handleInputChangeDescription = (e) => setDescription(e.target.value);

    const handleSelectedBlockchains = (selectedOptions) => {
        const selectedBlockchains = selectedOptions.map((option) => option.value);
        setBlockchainsSupported(selectedBlockchains);
    };

    const handleSelectedProtocols = (selectedOptions) => {
        const selectedProtocolValues = selectedOptions.map((option) => option.value);
        setProtocolsSupported(selectedProtocolValues);
    };

    const handleSelectedFeatures = (selectedOptions) => {
        const selectedFeatureValues = selectedOptions.map((option) => option.value);
        setFeaturesSupported(selectedFeatureValues);
    };

    const onNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const onBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = () => {
        // Submit logic
    };

    return (
        <Steps activeStep={activeStep} colorScheme="teal" size="lg">
            <Step label="Basic Information">
                <Box padding={4}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} onChange={handleInputChangeName} />
                        <FormHelperText>Enter the name of the app.</FormHelperText>
                    </FormControl>
                    {/* Other form controls for basic information */}
                    <Button onClick={onNext}>Next</Button>
                </Box>
            </Step>
            <Step label="Technical Details">
                <Box padding={4}>
                    <FormControl>
                        <FormLabel>Protocols Supported</FormLabel>
                        <Select
                            isMulti
                            name="protocols"
                            options={protocols}
                            placeholder="Select protocols..."
                            onChange={handleSelectedProtocols}
                        />
                        <FormHelperText>Enter all the protocols that the dapp supports.</FormHelperText>
                    </FormControl>
                    {/* Other form controls for technical details */}
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
                </Box>
            </Step>
        </Steps>
    );
};

export default SubmitDapps;
