import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button
} from '@chakra-ui/react';
import { usePioneer } from 'lib/context/Pioneer';
// @ts-ignore
import { Select as SelectImported } from 'chakra-react-select';

const protocols = [
    {
        value: 'slip44',
        label: 'slip44'
    },
    {
        value: 'erc20',
        label: 'erc20'
    },
    {
        value: 'ibc',
        label: 'ibc'
    }
];

const SubmitAssetsForm = ({ initialAsset, onSubmit }) => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;

    const [name, setName] = useState(initialAsset?.name || '');
    const [type, setApp] = useState(initialAsset?.type || '');
    const [image, setImage] = useState(initialAsset?.image || '');
    const [caip, setCAIP] = useState(initialAsset?.caip || '');
    const [symbol, setSymbol] = useState(initialAsset?.symbol || '');
    const [decimals, setDecimals] = useState(initialAsset?.decimals || '');
    const [blockchain, setBlockchain] = useState(initialAsset?.blockchain || '');
    const [facts, setFacts] = useState(initialAsset?.facts || []);
    const [tags, setTags] = useState(initialAsset?.tags || []);
    const [explorer, setExplorer] = useState(initialAsset?.explorer || '');
    const [protocolsSupported, setProtocolsSupported] = useState([]);

    const handleInputChangeName = (e) => setName(e.target.value);
    const handleInputChangeApp = (e) => setApp(e.target.value);
    const handleInputChangeImage = (e) => setImage(e.target.value);
    const handleInputChangeCAIP = (e) => setCAIP(e.target.value);
    const handleInputChangeSymbol = (e) => setSymbol(e.target.value);
    const handleInputChangeDecimals = (e) => setDecimals(e.target.value);
    const handleInputChangeBlockchain = (e) => setBlockchain(e.target.value);
    const handleInputChangeFacts = (e) => setFacts(e.target.value);
    const handleInputChangeTags = (e) => setTags(e.target.value);
    const handleInputChangeExplorer = (e) => setExplorer(e.target.value);

    const isError = false;

    const handleSubmit = async () => {
        try {
            const asset = {
                name,
                type,
                caip,
                tags: [],
                blockchain,
                symbol,
                decimals,
                image,
                facts,
                explorer
            };

            await onSubmit(asset);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectedProtocols = async (input) => {
        try {
            setProtocolsSupported(input);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <FormControl isInvalid={isError}>
                <FormLabel>Name</FormLabel>
                <Input type="text" value={name} onChange={handleInputChangeName} />
                {!isError ? (
                    <FormHelperText>Enter the name of the app.</FormHelperText>
                ) : (
                    <FormErrorMessage>Name is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Protocols Supported</FormLabel>
                <SelectImported
                    isMulti
                    name="type"
                    options={protocols}
                    placeholder="ibc... bip44...erc20..."
                    closeMenuOnSelect={true}
                    onChange={handleSelectedProtocols}
                />
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>CAIP</FormLabel>
                <Input type="text" value={caip} onChange={handleInputChangeCAIP} />
                {!isError ? (
                    <FormHelperText>Enter the CAIP</FormHelperText>
                ) : (
                    <FormErrorMessage>CAIP is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Symbol</FormLabel>
                <Input type="text" value={symbol} onChange={handleInputChangeSymbol} />
                {!isError ? (
                    <FormHelperText>Enter the symbol</FormHelperText>
                ) : (
                    <FormErrorMessage>Symbol is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Decimals</FormLabel>
                <Input type="text" value={decimals} onChange={handleInputChangeDecimals} />
                {!isError ? (
                    <FormHelperText>Enter the decimals</FormHelperText>
                ) : (
                    <FormErrorMessage>Decimals are required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Blockchain</FormLabel>
                <Input type="text" value={blockchain} onChange={handleInputChangeBlockchain} />
                {!isError ? (
                    <FormHelperText>Enter the blockchain</FormHelperText>
                ) : (
                    <FormErrorMessage>Blockchain is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Facts</FormLabel>
                <Input type="text" value={facts} onChange={handleInputChangeFacts} />
                {!isError ? (
                    <FormHelperText>Enter the facts</FormHelperText>
                ) : (
                    <FormErrorMessage>Facts are required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Tags</FormLabel>
                <Input type="text" value={tags} onChange={handleInputChangeTags} />
                {!isError ? (
                    <FormHelperText>Enter the tags</FormHelperText>
                ) : (
                    <FormErrorMessage>Tags are required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Explorer</FormLabel>
                <Input type="text" value={explorer} onChange={handleInputChangeExplorer} />
                {!isError ? (
                    <FormHelperText>Enter the explorer</FormHelperText>
                ) : (
                    <FormErrorMessage>Explorer is required.</FormErrorMessage>
                )}
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
};

export default SubmitAssetsForm;
