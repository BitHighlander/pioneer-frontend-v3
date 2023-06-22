import { Popover, PopoverTrigger, PopoverContent, PopoverBody, InputGroup, Spinner, InputLeftAddon, FormControl, Textarea, FormLabel, FormHelperText, Input, Button, Box, FormErrorMessage } from '@chakra-ui/react';
import { Steps, Step } from 'chakra-ui-steps';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { usePioneer } from 'lib/context/Pioneer';
import { protocols, features } from './Constants';
import { Select as SelectImported, components } from 'chakra-react-select';

const SubmitDapps = () => {
  const { state } = usePioneer();
  const { api, user, wallet } = state;
  const [name, setName] = useState('');
  const [app, setApp] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [minVersion, setMinVersion] = useState('');
  const [homepage, setHomepage] = useState('');
  const [urlError, setUrlError] = useState('');
  const [homepageError, setHomepageError] = useState('');
  const [blockchainsSupported, setBlockchainsSupported] = useState([]);
  const [protocolsSupported, setProtocolsSupported] = useState<any[]>(['wallet-connect']);
  const [featuresSupported, setFeaturesSupported] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isRest, setIsRest] = React.useState(false);
  const [blockchains, setBlockchains] = React.useState([]);
  const [socialMedia, setSocialMedia] = useState({
    twitter: '',
    telegram: '',
    github: '',
  });
  const handleInputChangeName = (e) => setName(e.target.value);
  const handleInputChangeApp = (e) => setApp(e.target.value);
  const handleInputChangeHomepage = (e) => setHomepage(e.target.value);
  const handleInputChangeImage = (e) => setImage(e.target.value);
  const handleInputChangeMinVersion = (e) => setMinVersion(e.target.value);
  const handleInputChangeDescription = (e) => setDescription(e.target.value);
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleHomepageChange = (event) => {
    setHomepage(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const isError = false;
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
    try {
      console.log('homepage: ', homepage);
      console.log('app: ', app);
      console.log('api: ', api);
      if (!api) alert('Failed to load API, reload application');
      if (!app) setApp(homepage);
      if (!homepage) setHomepage(app);
      const input = {
        app,
        homepage,
      };
      console.log('input: ', input);

      const result = await api.SubmitUrl(input);
      console.log('result: ', result.data);
      if (result.data) {
        // Filter out protocols that are not supported
        if (result.data.protocols) {
          const supportedProtocols = Object.keys(result.data.protocols).filter((key) => result.data.protocols[key]);
          const formatedProtocols: any = [];
          console.log('supportedProtocols: ', supportedProtocols);
          for (let i = 0; i < supportedProtocols.length; i++) {
            formatedProtocols.push({
              label: supportedProtocols[i],
              value: supportedProtocols[i],
            });
          }
          console.log('formatedProtocols: ', formatedProtocols);
          setProtocolsSupported(formatedProtocols);
        }

        // Convert CSV string to array for blockchains
        if (result.data.blockchains) {
          const blockchainArray = result.data.blockchains.split(',');
          console.log('blockchainArray: ', blockchainArray);

          const supportedBlockchains = [];
          for (let i = 0; i < blockchainArray.length; i++) {
            const name = blockchainArray[i].trim().toLowerCase();

            //filter where name is included in blockchains{name}
            // @ts-ignore
            //let matchedEntries = blockchains.filter(blockchain => blockchain.name.toLowerCase().includes(name))
            const matchedEntries = blockchains.filter((blockchain) => blockchain.name.includes(name));

            // Push each matched entry to supportedBlockchains array
            matchedEntries.forEach((entry) => supportedBlockchains.push(entry));
          }
          //create
          console.log('supportedBlockchains: ', supportedBlockchains);
          onSelectedBlockchains(supportedBlockchains);
        }

        // Convert CSV string to array for blockchains
        if (result.data.features) {
          const featuresArray = result.data.features.split(',');
          const featuresFormatted: any = [];
          for (let i = 0; i < featuresArray.length; i++) {
            featuresFormatted.push({
              label: featuresArray[i],
              value: featuresArray[i],
            });
          }
          console.log('featuresFormatted: ', featuresFormatted);
          setProtocolsSupported(featuresFormatted);
        }
        setName(result.data.name);
        setDescription(result.data.description);
        setImage(result.data.image);
        setFeaturesSupported(result.data.features);
        // @ts-ignore
      }
      setIsLoading(false);
      if (result.data.name) {
        return true;
      } else {
        alert('Invalid URL unable to load app');
        return false;
      }
    } catch (e) {
      console.error('submit error: ', e);
      setIsLoading(false);
      return false;
    }
  };

  const onNext = async () => {
    if (activeStep === 0) {
      setIsLoading(true);
      const result = await onSubmitName();
      if (result) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      console.log('Must submit first!');
    }
  };

  const onBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async () => {
    // Submit logic
    try {
      console.log('onSubmit()');

      //convert blockchains protocols and features to array of strings
      const blockchainsSupportedArray = [];
      for (let i = 0; i < blockchainsSupported.length; i++) {
        // @ts-ignore
        blockchainsSupportedArray.push(blockchainsSupported[i].name);
      }
      const protocolsSupportedArray = [];
      for (let i = 0; i < protocolsSupported.length; i++) {
        // @ts-ignore
        protocolsSupportedArray.push(protocolsSupported[i].value);
      }
      const featuresSupportedArray = [];
      for (let i = 0; i < featuresSupported.length; i++) {
        // @ts-ignore
        featuresSupportedArray.push(featuresSupported[i].value);
      }

      const dapp: any = {};
      dapp.name = name;
      dapp.app = app;
      dapp.homepage = app;
      dapp.tags = [...blockchainsSupportedArray, ...protocolsSupportedArray, ...featuresSupportedArray];
      dapp.image = image;
      dapp.minVersion = minVersion;
      dapp.description = description;
      dapp.protocols = protocolsSupportedArray;
      dapp.blockchains = blockchainsSupportedArray;
      dapp.features = featuresSupportedArray;

      //sign
      let payload: any = {
        name,
        app,
        homepage,
      };
      payload = JSON.stringify(payload);

      console.log('payload: ', payload);
      console.log('wallet: ', wallet);
      const signature = await wallet.ethSignMessage({
        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
        message: payload,
      });
      console.log('signature: ', signature);
      const addressInfo = {
        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
        coin: 'Ethereum',
        scriptType: 'ethereum',
        showDisplay: false,
      };
      const address = await wallet.ethGetAddress(addressInfo);
      dapp.developer = address;
      dapp.signer = address;
      dapp.payload = payload;
      dapp.signature = signature.signature;
      console.log('dapp: ', dapp);
      const txInfo = await api.ChartDapp(dapp);
      console.log('SUCCESS: ', txInfo.data);
      if (txInfo.data.success) {
        //show success message
        console.log('SUCCESS: ', txInfo.data);
      } else {
        alert(txInfo.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSelectedBlockchains = async function (inputs: any) {
    try {
      console.log('input: onSelectedBlockchains: ', inputs);
      const blockchains: any = [];
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        blockchains.push({ value: input.name || input.value, label: input.name || input.label });
      }
      console.log('supportedBlockchains: ', blockchains);
      setBlockchainsSupported(blockchains);
    } catch (e) {
      console.error(e);
    }
  };

  const onSelectedProtocols = async function (inputs: any) {
    try {
      console.log('input: onSelectedProtocols: ', inputs);
      const protocols: any = [];
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        protocols.push({ value: input.name || input.value, label: input.name || input.label });
      }
      console.log('protocols: ', protocols);
      setProtocolsSupported(protocols);
    } catch (e) {
      console.error(e);
    }
  };

  const onSelectedFeatures = async function (input: any) {
    try {
      console.log('input: onSelectedFeatures: ', input);
      setFeaturesSupported(input);
    } catch (e) {
      console.error(e);
    }
  };

  // simple url validation
  const validateURL = (text) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(text);
  };

  const onStart = async function () {
    try {
      if (api) {
        let blockchains = await api.SearchBlockchainsPaginate({ limit: 1000, skip: 0 });
        blockchains = blockchains.data;
        console.log('blockchains: ', blockchains.length);
        const blockchainsFormated: any = [];
        for (let i = 0; i < blockchains.length; i++) {
          const blockchain = blockchains[i];
          blockchain.value = blockchain.name;
          blockchain.label = blockchain.name;
          blockchainsFormated.push(blockchain);
        }
        //console.log("assetsFormated: ",assetsFormated.length)
        setBlockchains(blockchainsFormated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // onStart()
  useEffect(() => {
    onStart();
  }, [api]); //once on startup

  return (
    <Steps activeStep={activeStep} colorScheme="teal" size="lg">
      <Step label="Basic Information">
        <Box padding={4}>
          <div>
            {isLoading ? (
              <p>
                <Spinner size="xl"></Spinner>Loading...
              </p>
            ) : (
              <>
                <div>
                  <Popover isOpen={Boolean(urlError)} onClose={() => setUrlError('')}>
                    <PopoverTrigger>
                      <div> {/* Trigger element */}</div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        <div style={{ padding: '10px' }}>{urlError}</div>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>

                  <Popover isOpen={Boolean(homepageError)} onClose={() => setHomepageError('')}>
                    <PopoverTrigger>
                      <div> {/* Trigger element */}</div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        <div style={{ padding: '10px' }}>{homepageError}</div>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <FormControl isInvalid={isError}>
                    <FormLabel>Homepage URL</FormLabel>
                    <Input type="email" value={homepage} onChange={handleInputChangeHomepage} />
                    {!isError ? <FormHelperText>Homepage is the Landing, generally designed to be indexed by crawlers.</FormHelperText> : <FormErrorMessage>Homepage URL is required.</FormErrorMessage>}
                  </FormControl>
                </div>
                <div>
                  <FormControl isInvalid={isError}>
                    <FormLabel>App URL</FormLabel>
                    <Input type="email" value={app} onChange={handleInputChangeApp} />
                    {!isError ? <FormHelperText>{'(optional) Enter the URL of the dapp application itself, generally app.serviceName*.com'}</FormHelperText> : <FormErrorMessage>App URL is required.</FormErrorMessage>}
                  </FormControl>
                </div>
                <div>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea rows={2} cols={50} placeholder="(optional) Describe why this app is useful and relevant." value={description} onChange={handleDescriptionChange}></textarea>
                  </FormControl>
                </div>
                <Button onClick={onNext} disabled={activeStep === 0} padding="10px 20px" borderRadius="5px" backgroundColor={activeStep === 0 ? 'gray' : 'blue'} color="white" boxShadow="0px 2px 4px rgba(0, 0, 0, 0.3)" textTransform="uppercase" fontWeight="bold" transition="background-color 0.3s ease" cursor={activeStep === 0 ? 'not-allowed' : 'pointer'}>
                  Next
                </Button>
              </>
            )}
          </div>
        </Box>
      </Step>
      <Step label="Technical Details">
        <div>
          <FormControl isInvalid={isError}>
            <FormLabel>Name</FormLabel>
            <Input type="email" value={name} onChange={handleInputChangeName} />
            {!isError ? <FormHelperText>Enter the name of the app.</FormHelperText> : <FormErrorMessage>name is required.</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={isError}>
            <FormLabel>Homepage URL</FormLabel>
            <Input type="email" value={homepage} onChange={handleInputChangeApp} />
            {!isError ? <FormHelperText>Homepage is the Landing, gernally designed to be indexed by crawlers.</FormHelperText> : <FormErrorMessage>URL is required.</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={isError}>
            <FormLabel>App URL</FormLabel>
            <Input type="email" value={app} onChange={handleInputChangeApp} />
            {!isError ? <FormHelperText>Enter the URL of the dapp application itself, gerneally app.serviceName*.com</FormHelperText> : <FormErrorMessage>URL is required.</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={isError}>
            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
              {image && <img src={image} alt="Image Preview" style={{ width: '100px', height: '100px' }} />}
              <FormLabel>Image URL</FormLabel>
              <Input type="email" value={image} onChange={handleInputChangeImage} />
            </div>
            {!isError ? <FormHelperText>Enter the URL of the image for the Dapp. This MUST be a valid URL and not an encoding!</FormHelperText> : <FormErrorMessage>Image URL is required.</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={isError}>
            <FormLabel>Dapp Desription</FormLabel>
            <Textarea placeholder="This Dapp is great because it does..... " value={description} onChange={handleInputChangeDescription} />
            {!isError ? <FormHelperText>Describe the Dapp in a short paragraph.</FormHelperText> : <FormErrorMessage>description is required.</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={isError}>
            Blockchains Supported By Dapp
            <SelectImported
              isMulti
              name="assets"
              options={blockchains}
              placeholder="ethereum... bitcoin... avalanche...."
              closeMenuOnSelect={true}
              value={blockchainsSupported}
              // components={{ Option: IconOption }}
              onChange={onSelectedBlockchains}
            ></SelectImported>
            <FormHelperText>Enter all the blockchains that the dapp supports.</FormHelperText>
          </FormControl>
          <FormControl isInvalid={isError}>
            <FormLabel>Protocols Supported</FormLabel>
            <SelectImported
              isMulti
              name="assets"
              options={protocols}
              placeholder="wallet-connect... wallet-connect-v2... REST...."
              closeMenuOnSelect={true}
              value={protocolsSupported}
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
          <FormControl isInvalid={isError}>
            <FormLabel>Social Media</FormLabel>
            <InputGroup>
              <InputLeftAddon children="Twitter" />
              <Input type="text" name="twitter" value={socialMedia.twitter} onChange={handleSocialMediaChange} />
            </InputGroup>
          </FormControl>

          <FormControl isInvalid={isError}>
            <FormLabel>Social Media</FormLabel>
            <InputGroup>
              <InputLeftAddon children="Telegram" />
              <Input type="text" name="telegram" value={socialMedia.telegram} onChange={handleSocialMediaChange} />
            </InputGroup>
          </FormControl>

          <FormControl isInvalid={isError}>
            <FormLabel>Social Media</FormLabel>
            <InputGroup>
              <InputLeftAddon children="GitHub" />
              <Input type="text" name="github" value={socialMedia.github} onChange={handleSocialMediaChange} />
            </InputGroup>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            //isLoading={props.isSubmitting}
            type="submit"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
        <Button onClick={onBack}>Back</Button>
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
