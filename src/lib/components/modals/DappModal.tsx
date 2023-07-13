import { useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalCloseButton,
    ModalOverlay,
    ModalContent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Textarea,
    Button,
    Box,
    Heading,
    Avatar,
    Text,
    Card,
    InputGroup,
    ModalFooter,
    Table,
    Thead,
    Tbody,
    Tfoot, Tr, Th, Td, InputLeftAddon
} from '@chakra-ui/react';
import { Select as SelectImported } from 'chakra-react-select';
import React, { useEffect } from 'react';
import { usePioneer } from 'lib/context/Pioneer';
//import { protocols, features } from 'lib/context/tools/Constants';

const protocols = [
    {
        value: 'wallet-connect',
        label: 'Wallet Connect',
    },
    {
        value: 'wallet-connect-v2',
        label: 'Wallet Connect-v2',
    },
    {
        value: 'REST',
        label: 'REST',
    },
];

const features = [
    {
        value: 'basic-transfers',
        label: 'basic-transfers',
    },
    {
        value: 'defi-earn',
        label: 'defi-earn',
    },
    {
        value: 'defi-swap',
        label: 'defi-swap',
    },
    {
        value: 'defi-governence',
        label: 'defi-governence',
    },
    {
        value: 'other',
        label: 'other',
    },
];


export function DappModal({ isOpen, onClose, data }) {
    const [tabIndex, setTabIndex] = useState(0);
    const { state } = usePioneer();
    const { api, wallet } = state;
    const [entry, setEntry] = useState<any>({});
    const [allUpVotesContext, setAllUpVotesContext] = useState<any[]>([]);
    const [allDownVotesContext, setAllDownVotesContext] = useState<any[]>([]);
    const [app, setApp] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isPioneer, setIsPioneer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [homepage, setHomepage] = useState('');
    const [urlError, setUrlError] = useState('');
    const [homepageError, setHomepageError] = useState('');
    const [blockchainsSupported, setBlockchainsSupported] = useState<any[]>([]);
    const [protocolsSupported, setProtocolsSupported] = useState<any[]>(['wallet-connect']);
    const [featuresSupported, setFeaturesSupported] = useState<any[]>([]);
    const [activeStep, setActiveStep] = useState(0);
    const [minVersion, setMinVersion] = React.useState([]);
    const [blockchains, setBlockchains] = React.useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [reviewList, setReviewList] = React.useState<any[]>([]);
    const [isSubmitingReview, setIsSubmitingReview] = React.useState(false);
    const [starRating, setStarRating] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [socialMedia, setSocialMedia] = useState({
        twitter: '',
        telegram: '',
        github: 'https://github.com/shapeshift/',
    });
    const reviewsPerPage = 5;
    const handleInputChangeName = (e) => {
        setUrl(e.target.value);
        setIsValid(validateURL(e.target.value));
    };
    const handleTabChange = (index) => {
        setTabIndex(index);
    };
    const handleInputChangeApp = (e) => setApp(e.target.value);
    const handleInputChangeImage = (e) => setImage(e.target.value);
    const handleInputChangeMinVersion = (e) => setMinVersion(e.target.value);
    const handleInputChangeDescription = (e) => setDescription(e.target.value);
    const handleInputChangeHomepage = (e) => setHomepage(e.target.value);
    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setSocialMedia((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleHomepageChange = (event) => {
        setHomepage(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
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

    const onRevokeEntry = async function (app: any) {
        try {
            console.log('revoke entry: ', app);
            //submit as pioneer

            const payload = `{"type": "revoke", "app": "${app}"}`;
            console.log('payload: ', entry);

            //
            const signature = await wallet.ethSignMessage({
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                message: payload,
            });
            const revoke: any = {};
            const addressInfo = {
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                coin: 'Ethereum',
                scriptType: 'ethereum',
                showDisplay: false,
            };
            revoke.signer = await wallet.ethGetAddress(addressInfo);
            revoke.payload = payload;
            revoke.signature = signature.signature;
            if (!revoke.signer) throw Error('address required!');

            const resultWhitelist = await api.RevokeApp(revoke);
            console.log('resultWhitelist: ', resultWhitelist);
        } catch (e) {
            console.error(e);
        }
    };
    
    const onSubmitEdit = async () => {
        try {
            console.log('onSubmitEdit: ');
            const updatePayload: any = {};

            // Compare the form state with the selected entry's values
            if (name !== entry.name) {
                updatePayload.name = name;
            }
            if (app !== entry.app) {
                updatePayload.app = app;
            }
            if (image !== entry.image) {
                updatePayload.image = image;
            }
            if (description !== entry.description) {
                updatePayload.description = description;
            }
            if (homepage !== entry.homepage) {
                updatePayload.homepage = homepage;
            }
            if (JSON.stringify(blockchainsSupported) !== JSON.stringify(entry.blockchains)) {
                updatePayload.blockchains = blockchainsSupported;
            }
            if (JSON.stringify(protocolsSupported) !== JSON.stringify(entry.protocols)) {
                updatePayload.protocols = protocolsSupported;
            }
            if (JSON.stringify(featuresSupported) !== JSON.stringify(entry.features)) {
                updatePayload.features = featuresSupported;
            }
            if (socialMedia.twitter !== (entry.socialMedia?.twitter || '')) {
                updatePayload.socialMedia = { twitter: socialMedia.twitter };
            }
            if (socialMedia.telegram !== (entry.socialMedia?.telegram || '')) {
                updatePayload.socialMedia = { ...updatePayload.socialMedia, telegram: socialMedia.telegram };
            }
            if (socialMedia.github !== (entry.socialMedia?.github || 'https://github.com/shapeshift/')) {
                updatePayload.socialMedia = { ...updatePayload.socialMedia, github: socialMedia.github };
            }

            const fieldChanged = Object.keys(updatePayload)[0]; // Get the first changed field

            if (fieldChanged) {
                // Sign the message indicating the changed field
                const signature = await wallet.ethSignMessage({
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    message: `Changed ${fieldChanged} field`,
                });

                console.log('Signature:', signature);
                const addressInfo = {
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    coin: 'Ethereum',
                    scriptType: 'ethereum',
                    showDisplay: false,
                };
                const address = await wallet.ethGetAddress(addressInfo);
                // Submit the updated fields to the API
                const updateData = {
                    name: entry.name,
                    signer: address,
                    field: fieldChanged,
                    value: updatePayload[fieldChanged],
                    signature: signature.signature,
                };

                const result = await api.UpdateApp(updateData);
                console.log('API Response:', result);
            }
        } catch (e) {
            console.error(e);
        }
    };
    const onStart = async function () {
        try {
            //get Dapp info
            
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        onStart();
    }, [api]);
    
    const UpVotesTable = () => (
        <>
            <Box mb={4} fontWeight="bold" fontSize="xl">
                Up Votes
            </Box>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th>Weight</Th>
                        {/* Add other table headers */}
                    </Tr>
                </Thead>
                <Tbody>
                    {allUpVotesContext.map((vote, index) => (
                        <Tr key={`upVote-${index}`}>
                            <Td fontSize="sm">{vote.address}</Td>
                            <Td fontSize="lg">{vote.weight}</Td>
                            {/* Render other vote-related data */}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );

    const DownVotesTable = () => (
        <>
            <Box mb={4} fontWeight="bold" fontSize="xl">
                Down Votes
            </Box>
            <Table variant="striped" colorScheme="teal">
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th>Weight</Th>
                        {/* Add other table headers */}
                    </Tr>
                </Thead>
                <Tbody>
                    {allDownVotesContext.map((vote, index) => (
                        <Tr key={`downVote-${index}`}>
                            <Td fontSize="sm">{vote.address}</Td>
                            <Td fontSize="lg">{vote.weight}</Td>
                            {/* Render other vote-related data */}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );


    // @ts-ignore
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent width="80%">
                <TabList>
                    <Tab>Info</Tab>
                    <Tab>Form</Tab>
                    <Tab>Vote History</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Card>
                            <Box p={4}>
                                <Box display="flex" alignItems="center">
                                    <Avatar src={image} size="xl" border="4px solid #000" />
                                    <Box ml={4}>
                                        <Button colorScheme="blue" size="lg" onClick={() => window.open(app, '_blank')}>
                                            Launch App
                                        </Button>
                                        <Heading as="h3" size="lg" fontWeight="bold">
                                            {name}
                                        </Heading>
                                    </Box>
                                </Box>
                                <Box mt={4}>
                                    <Box border="1px solid gray" borderRadius="md" p={2} mt={4}>
                                        <Text>
                                            <strong>App:</strong> {app}
                                        </Text>
                                        <Text>
                                            <strong>Homepage:</strong> {homepage}
                                        </Text>
                                        <Text>
                                            <strong>Description:</strong> {description}
                                        </Text>
                                    </Box>
    
                                    <Box border="1px solid gray" borderRadius="md" p={2} mt={4}>
                                        <Text fontWeight="bold">Blockchains Supported:</Text>
                                        {blockchainsSupported
                                            ? blockchainsSupported.map((blockchain) => (
                                                <Text key={blockchain?.value} pl={4}>
                                                    - {blockchain?.label}
                                                </Text>
                                            ))
                                            : null}
                                        <Button size={'xs'} onClick={() => handleTabChange(1)}>
                                            edit
                                        </Button>
                                    </Box>
    
                                    <Box border="1px solid gray" borderRadius="md" p={2} mt={4}>
                                        <Text fontWeight="bold">Protocols Supported:</Text>
                                        {protocolsSupported
                                            ? protocolsSupported.map((protocol) => (
                                                <Text key={protocol.value} pl={4}>
                                                    - {protocol?.label}
                                                </Text>
                                            ))
                                            : null}
                                        <Button size={'xs'} onClick={() => handleTabChange(1)}>
                                            edit
                                        </Button>
                                    </Box>
    
                                    <Box border="1px solid gray" borderRadius="md" p={2} mt={4}>
                                        <Text fontWeight="bold">Features Supported:</Text>
                                        {featuresSupported
                                            ? featuresSupported.map((feature) => (
                                                <Text key={feature.value} pl={4}>
                                                    - {feature}
                                                </Text>
                                            ))
                                            : null}
                                        <Button size={'xs'} onClick={() => handleTabChange(1)}>
                                            edit
                                        </Button>
                                    </Box>
    
                                    <Box border="1px solid gray" borderRadius="md" p={2} mt={4}>
                                        <Text fontWeight="bold">Social Media:</Text>
                                        <Text>
                                            <strong>Twitter:</strong> {socialMedia.twitter}
                                        </Text>
                                        <Text>
                                            <strong>Telegram:</strong> {socialMedia.telegram}
                                        </Text>
                                        <Text>
                                            <strong>Github:</strong> {socialMedia.github}
                                        </Text>
                                        <Button size={'xs'} onClick={() => handleTabChange(1)}>
                                            edit
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <ModalHeader>Edit Entry</ModalHeader>
                        <ModalCloseButton />
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" value={name} onChange={(e) => console.log(e.target.value)} />
                            <FormHelperText>Enter the name of the app.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Homepage URL</FormLabel>
                            <Input type="text" value={homepage} onChange={(e) => console.log(e.target.value)} />
                            <FormHelperText>Homepage is the Landing, generally designed to be indexed by crawlers.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>App URL</FormLabel>
                            <Input type="text" value={app} onChange={(e) => console.log(e.target.value)} />
                            <FormHelperText>
                                Enter the URL of the dapp application itself, generally app.serviceName*.com
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                                {image && <img src={image} alt="Image Preview" style={{ width: '100px', height: '100px' }} />}
                                <FormLabel>Image URL</FormLabel>
                                <Input type="text" value={image} onChange={(e) => console.log(e.target.value)} />
                            </div>
                            <FormHelperText>
                                Enter the URL of the image for the Dapp. This MUST be a valid URL and not an encoding!
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Dapp Description</FormLabel>
                            <Textarea
                                placeholder="This Dapp is great because it does....."
                                value={description}
                                onChange={(e) => console.log(e.target.value)}
                            />
                            <FormHelperText>Describe the Dapp in a short paragraph.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            Blockchains Supported By Dapp
                            <SelectImported
                                isMulti
                                name="assets"
                                options={blockchains}
                                placeholder="ethereum... bitcoin... avalanche...."
                                closeMenuOnSelect={true}
                                value={blockchainsSupported}
                                onChange={(selected) => console.log(selected)}
                            ></SelectImported>
                            <FormHelperText>Enter all the blockchains that the dapp supports.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Protocols Supported</FormLabel>
                            <SelectImported
                                isMulti
                                name="assets"
                                options={protocols}
                                placeholder="wallet-connect... wallet-connect-v2... REST...."
                                closeMenuOnSelect={true}
                                value={protocolsSupported}
                                onChange={(selected) => console.log(selected)}
                            ></SelectImported>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Features Supported</FormLabel>
                            <SelectImported
                                isMulti
                                name="features"
                                options={features}
                                placeholder="basic-transfers... defi-earn...."
                                closeMenuOnSelect={true}
                                onChange={(selected) => console.log(selected)}
                            ></SelectImported>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Social Media</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children="Twitter" />
                                <Input type="text" name="twitter" value={socialMedia.twitter} onChange={(e) => console.log(e.target.value)} />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Social Media</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children="Telegram" />
                                <Input type="text" name="telegram" value={socialMedia.telegram} onChange={(e) => console.log(e.target.value)} />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Social Media</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children="GitHub" />
                                <Input type="text" name="github" value={socialMedia.github} onChange={(e) => console.log(e.target.value)} />
                            </InputGroup>
                        </FormControl>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button onClick={onSubmitEdit} variant="green">
                                Submit changes
                            </Button>
                        </ModalFooter>
                    </TabPanel>
                    <TabPanel>
                        <FormControl>
                            <table>
                                <UpVotesTable />
                                <DownVotesTable />
                            </table>
                        </FormControl>
                    </TabPanel>
                </TabPanels>
            </ModalContent>
        </Modal>
    );
}
