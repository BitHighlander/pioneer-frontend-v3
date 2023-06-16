import { FormControl, Textarea, FormLabel, FormHelperText, Input, Button, Box, FormErrorMessage } from '@chakra-ui/react';
import { Steps, Step } from 'chakra-ui-steps';
import React, { useState } from 'react';
import Select from 'react-select';
import { usePioneer } from 'lib/context/Pioneer';
import { protocols, features } from './Constants';
import { Select as SelectImported, components } from "chakra-react-select";
const SubmitDapps = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const [name, setName] = useState('');
    const [app, setApp] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [minVersion, setMinVersion] = useState('');
    const [blockchainsSupported, setBlockchainsSupported] = useState([]);
    const [protocolsSupported, setProtocolsSupported] = useState<string[]>([]);
    const [featuresSupported, setFeaturesSupported] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isRest, setIsRest] = React.useState(false)
    const [blockchains, setBlockchains] = React.useState([])
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

    //review dapp.
    const onSubmitName = async () => {
        // Submit logic
        try{
            console.log("name: ",name)
            console.log("api: ",api)
            let result = await api.SubmitUrl({url: name, username: user.username});
            console.log("result: ", result.data);
            setApp(name);
            // Filter out protocols that are not supported
            const supportedProtocols = Object.keys(result.data.protocols).filter(key => result.data.protocols[key]);
            setProtocolsSupported(supportedProtocols);

            // Convert CSV string to array for blockchains
            if(result.data.blockchains){
                const blockchainArray = result.data.blockchains.split(",");
                setBlockchains(blockchainArray);
            }

            // Convert CSV string to array for blockchains
            if(result.data.features){
                const featuresArray = result.data.features.split(",");
                setFeaturesSupported(featuresArray);
            }

            setDescription(result.data.description);
            setImage(result.data.image);
            setFeaturesSupported(result.data.features);
            
        }catch(e){
            console.error(e)
        }
    };

    const onNext = async () => {
        if(activeStep === 0){
            await onSubmitName();
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const onBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const onSubmit = async () => {
        // Submit logic
        try{
            console.log("onSubmit()")

            let dapp:any = {}
            dapp.name = name
            dapp.app = app
            dapp.homepage = app
            dapp.tags = [...blockchainsSupported,...protocols]
            dapp.image = image
            dapp.minVersion = minVersion
            dapp.description = description
            dapp.protocols = protocolsSupported
            dapp.blockchains = blockchainsSupported
            dapp.features = featuresSupported
            
            //sign
            let payload:any = {
                name,
                app,
                homepage:app
            }
            payload = JSON.stringify(payload)

            console.log("payload: ",payload)
            console.log("wallet: ",wallet)
            let signature = await wallet.ethSignMessage({
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                message: payload,
            })
            console.log("signature: ",signature)
            dapp.developer = wallet.ethAddress.toLowerCase()
            dapp.signer = wallet.ethAddress.toLowerCase()
            dapp.payload = payload
            dapp.signature = signature.signature
            console.log("dapp: ",dapp)
            let txInfo = await api.ChartDapp(dapp)
            console.log("SUCCESS: ",txInfo.data)
            
        }catch(e){
            console.error(e)
        }
    };

    let onSelectedBlockchains = async function(inputs: any){
        try{
            console.log("input: onSelectedBlockchains: ",inputs)
            let blockchains:any = []
            for(let i = 0; i < inputs.length; i++){
                let input = inputs[i]
                blockchains.push(input.name)
            }
            setBlockchainsSupported(blockchains)
        }catch(e){
            console.error(e)
        }
    };

    let onSelectedProtocols = async function(input: any){
        try{
            console.log("input: onSelectedProtocols: ",input)
            setProtocolsSupported(input)
            let isRestFound
            for(let i = 0; i < input.length; i++){
                let protocol = input[i]
                if(protocol.value === 'REST'){
                    setIsRest(true)
                    isRestFound = true
                }
            }
            if(!isRestFound){
                setIsRest(false)
            }
        }catch(e){
            console.error(e)
        }
    };

    let onSelectedFeatures = async function(input: any){
        try{
            console.log("input: onSelectedFeatures: ",input)
            setFeaturesSupported(input)
        }catch(e){
            console.error(e)
        }
    };

    const isError = false

    return (
        <Steps activeStep={activeStep} colorScheme="teal" size="lg">
            <Step label="Basic Information">
                <Box padding={4}>
                    <FormControl>
                        <FormLabel>url</FormLabel>
                        <Input value={name} onChange={handleInputChangeName} />
                        <FormHelperText>Enter the url of the dApp.</FormHelperText>
                    </FormControl>
                    {/* Other form controls for basic information */}
                    <Button onClick={onNext}>Next</Button>
                </Box>
            </Step>
            <Step label="Technical Details">
                <div>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Name</FormLabel>
                        <Input type='email' value={name} onChange={handleInputChangeName} />
                        {!isError ? (
                            <FormHelperText>
                                Enter the name of the app.
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>name is required.</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        <FormLabel>App URL</FormLabel>
                        <Input type='email' value={app} onChange={handleInputChangeApp} />
                        {!isError ? (
                            <FormHelperText>
                                Enter the URL of the dapp application
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>URL is required.</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Image URL</FormLabel>
                        <Input type='email' value={image} onChange={handleInputChangeImage} />
                        {!isError ? (
                            <FormHelperText>
                                Enter the URL of image for the Dapp. this MUST be a valid URL, and not a encoding!
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>image URL is required.</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Dapp Desription</FormLabel>
                        <Textarea placeholder="This Dapp is great because it does..... " value={description} onChange={handleInputChangeDescription} />
                        {!isError ? (
                            <FormHelperText>
                                Describe the Dapp in a short paragraph.
                            </FormHelperText>
                        ) : (
                            <FormErrorMessage>description is required.</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        Blockchains Supported By Dapp
                        <SelectImported
                            isMulti
                            name="assets"
                            options={blockchains}
                            placeholder="ethereum... bitcoin... avalanche...."
                            closeMenuOnSelect={true}
                            // components={{ Option: IconOption }}
                            onChange={onSelectedBlockchains}
                        ></SelectImported>
                        <FormHelperText>
                            Enter all the blockchains that the dapp supports.
                        </FormHelperText>
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Protocols Supported</FormLabel>
                        <SelectImported
                            isMulti
                            name="assets"
                            options={protocols}
                            placeholder="wallet-connect... wallet-connect-v2... REST...."
                            closeMenuOnSelect={true}
                            // components={{ Option: IconOption }}
                            onChange={onSelectedProtocols}
                        ></SelectImported>
                    </FormControl>
                    <FormControl isInvalid={isError}>
                        <FormLabel>Features Supported</FormLabel>
                        <SelectImported
                            isMulti
                            name="features"
                            options={features}
                            placeholder="basic-transfers... defi-earn...."
                            closeMenuOnSelect={true}
                            // components={{ Option: IconOption }}
                            onChange={onSelectedFeatures}
                        ></SelectImported>
                    </FormControl>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        //isLoading={props.isSubmitting}
                        type='submit'
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                </div>
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
