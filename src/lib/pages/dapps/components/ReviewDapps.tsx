import {
    Grid,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    InputGroup,
    InputLeftAddon,
    ModalBody, Textarea, ModalFooter, useDisclosure, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage
} from "@chakra-ui/react";
import React from 'react'
import ReactDOM from 'react-dom/client'
// import { useAlert } from 'react-alert'
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { protocols, features } from './Constants';
import { useEffect, useState } from "react";
import {Select as SelectImported} from "chakra-react-select";
const columnHelper = createColumnHelper<any>()
import { usePioneer } from 'lib/context/Pioneer';

const ReviewDapps = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const alert = useAlert()
    const [entry, setEntry] = useState<any>({});
    const [votedUpNames, setVotedUpNames] = React.useState(() => [])
    const [votedDownNames, setVotedDownNames] = React.useState(() => [])
    const [data, setData] = React.useState(() => [])
    const [name, setName] = useState('');
    const [app, setApp] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [homepage, setHomepage] = useState('');
    const [urlError, setUrlError] = useState('');
    const [homepageError, setHomepageError] = useState('');
    const [blockchainsSupported, setBlockchainsSupported] = useState([]);
    const [protocolsSupported, setProtocolsSupported] = useState<any[]>(['wallet-connect']);
    const [featuresSupported, setFeaturesSupported] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [minVersion, setMinVersion] = React.useState([])
    const [blockchains, setBlockchains] = React.useState([])
    const [isRest, setIsRest] = React.useState(false)
    const [socialMedia, setSocialMedia] = useState({
        twitter: '',
        telegram: '',
        github: 'https://github.com/shapeshift/'
    });
    const handleInputChangeName = (e) => {
        setUrl(e.target.value);
        setIsValid(validateURL(e.target.value));
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
            [name]: value
        }));
    };
    // simple url validation
    const validateURL = (text) => {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
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
    const isError = false
    const toast = useToast()

    let isUpActive = function(name:string){
        console.log("isUpActive: ",name)
        // @ts-ignore
        if(votedUpNames.indexOf(name) >= 0){
            console.log("isUpActive: TRUE",name)
            return 'green'
        } else {
            console.log("isUpActive: FALSE",name)
            return 'gray'
        }
    }

    const columns = [
        columnHelper.accessor("image", {
            cell: (info) => (
                info.getValue() ?
                    <Image
                        src={info.getValue()}
                        alt="keepkey api"
                        objectFit="cover"
                        height="60px"
                        width="60px"
                        objectPosition="center"
                    />
                    : null
            ),
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('app', {
            cell: info => (
                <div style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={info.getValue()}>{info.getValue()}</a>
                </div>
            ),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('score', {
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('name', {
            id: 'upvote',
            cell: info => <Button
                onClick={() => upVote(info.getValue())}
            ><ArrowUpIcon w={8} h={8} color="green.500" /></Button>,
            header: () => <span>upvote</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('name', {
            id: 'downvote',
            cell: info => <Button onClick={() => downVote(info.getValue())}><ArrowDownIcon w={8} h={8} color="red.500" /></Button>,
            header: () => <span>downvote</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('name', {
            id: 'edit',
            cell: info => (
                <Button onClick={() => editEntry(info.row.original.name)}>
                    edit
                </Button>
            ),
            header: () => <span>edit</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('revoke', {
            id: 'revoke',
            cell: info => (
                <Button colorScheme='red' onClick={() => onRevokeEntry(info.row.original.app)}>
                    revoke
                </Button>
            ),
            header: () => <span>edit</span>,
            footer: info => info.column.id,
        })
        // columnHelper.accessor('name', {
        //   id: 'approve',
        //   cell: info => <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>,
        //   header: () => <span>approve</span>,
        //   footer: info => info.column.id,
        // }),
    ]

    let onStart = async function(){
        try{


            //get all unapproved dapps
            let apps = await api.SearchDappsPageniate({limit:1000,skip:0})
            console.log("apps: ",apps.data.length)
            console.log("apps: ",apps.data[0])
            const sortArrayByScore = (arr: any[]) => {
                return arr.sort((a, b) => {
                    if (a.score === undefined) a.score = 0;
                    if (b.score === undefined) b.score = 0;
                    return b.score - a.score;
                });
            }
            apps.data = sortArrayByScore(apps.data)
            console.log("apps: ",apps.data)

            //setData
            setData(apps.data)

            let blockchains = await api.SearchBlockchainsPaginate({limit:1000,skip:0})
            blockchains = blockchains.data
            console.log("blockchains: ",blockchains.length)
            let blockchainsFormated:any = []
            for(let i = 0; i < blockchains.length; i++){
                let blockchain = blockchains[i]
                blockchain.value = blockchain.name
                blockchain.label = blockchain.name
                blockchainsFormated.push(blockchain)
            }
            console.log("blockchainsFormated: ",blockchainsFormated.length)
            setBlockchains(blockchainsFormated)

        }catch(e){
            console.error(e)
        }
    }

    //onstart get data
    useEffect(() => {
        onStart()
    }, [])

    let upVote = async function(name:string){
        try{
            //update entry
            let entry = {
                "name":name,
                "vote":"up"
            }
            //toString
            let payload = JSON.stringify(entry)
            let signature = await await wallet.ethSignMessage({
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                message: payload,
            })
            let addressInfo = {
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                coin: 'Ethereum',
                scriptType: 'ethereum',
                showDisplay: false
            }
            let address = await wallet.ethGetAddress(addressInfo);
            let update:any = {}

            if(!address) throw Error("address required!")
            update.signer = address
            update.payload = payload
            update.signature = signature.signature
            if(!address) throw Error("address required!")
            //submit as admin
            console.log("update: ",update)
            let resultWhitelist = await api.VoteOnApp(update)
            console.log("resultWhitelist: ",resultWhitelist)

            toast({
                title: 'User Voted!.',
                description: "You UP voted for "+name+ " result: "+resultWhitelist.data?.message,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            onStart()
            setTimeout(onStart,2000)
        }catch(e){
            console.error(e)
        }
    }

    let downVote = async function(name:string){
        try{
            //update entry
            let entry = {
                "name":name,
                "vote":"down"
            }
            //toString
            let payload = JSON.stringify(entry)

            if(!wallet || !wallet.provider) throw Error("Onbord not setup!")
            let signature = await wallet.ethSignMessage({
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                message: payload,
            })
            console.log("signature: ",signature)

            let update:any = {}
            let address = wallet.ethAddress.toLowerCase()
            update.payload = payload
            update.signature = signature
            if(!address) throw Error("address required!")
            //submit as admin
            console.log("update: ",update)
            let resultWhitelist = await api.VoteOnApp(update)
            console.log("resultWhitelist: ",resultWhitelist)

            toast({
                title: 'User Voted!.',
                description: "You DOWN voted for "+name+ " result: "+resultWhitelist.data?.message,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            onStart()
            setTimeout(onStart,2000)

        }catch(e){
            console.error(e)
        }
    }

    let submitVotes = async function(){
        try{
            //open modal
            console.log("submitVotes: ")
        }catch(e){
            console.error(e)
        }
    }

    let editEntry = async function(name) {
        try {
            console.log("Edit entry: ", name);
            onOpen();

            // Find the selected entry by name
            // @ts-ignore
            const selectedEntry = data.find(entry => entry.name === name);
            if (!selectedEntry) {
                console.error("Entry not found");
                return;
            }

            // Set the local state variables with the selected entry's values
            // @ts-ignore
            setName(selectedEntry.name);
            // @ts-ignore
            setApp(selectedEntry.app);
            // @ts-ignore
            setImage(selectedEntry.image);
            // @ts-ignore
            setDescription(selectedEntry.description);
            // @ts-ignore
            setHomepage(selectedEntry.homepage);
            // @ts-ignore
            setBlockchainsSupported(selectedEntry.blockchains);
            // @ts-ignore
            setProtocolsSupported(selectedEntry.protocols);
            // @ts-ignore
            setFeaturesSupported(selectedEntry.features);
            // @ts-ignore
            setSocialMedia({
                // @ts-ignore
                twitter: selectedEntry.socialMedia?.twitter || '',
                // @ts-ignore
                telegram: selectedEntry.socialMedia?.telegram || '',
                // @ts-ignore
                github: selectedEntry.socialMedia?.github || 'https://github.com/shapeshift/',
            });
        } catch (e) {
            console.error(e);
        }
    };


    const onSubmitEdit = async () => {
        try {
            console.log("onSubmitEdit: ");

            const updatePayload:any = {};

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
            if (socialMedia.twitter !== (entry.socialMedia?.twitter || "")) {
                updatePayload.socialMedia = { twitter: socialMedia.twitter };
            }
            if (socialMedia.telegram !== (entry.socialMedia?.telegram || "")) {
                updatePayload.socialMedia = { ...updatePayload.socialMedia, telegram: socialMedia.telegram };
            }
            if (socialMedia.github !== (entry.socialMedia?.github || "https://github.com/shapeshift/")) {
                updatePayload.socialMedia = { ...updatePayload.socialMedia, github: socialMedia.github };
            }

            const fieldChanged = Object.keys(updatePayload)[0]; // Get the first changed field

            if (fieldChanged) {
                // Sign the message indicating the changed field
                const signature = await wallet.ethSignMessage({
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    message: `Changed ${fieldChanged} field`,
                });

                console.log("Signature:", signature);
                let addressInfo = {
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    coin: 'Ethereum',
                    scriptType: 'ethereum',
                    showDisplay: false
                }
                let address = await wallet.ethGetAddress(addressInfo);
                // Submit the updated fields to the API
                const updateData = {
                    name: entry.name,
                    signer: address,
                    field: fieldChanged,
                    value: updatePayload[fieldChanged],
                    signature: signature.signature,
                };

                const result = await api.UpdateApp(updateData);
                console.log("API Response:", result);
            }
        } catch (e) {
            console.error(e);
        }
    };


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // let handleInputChange = (e: { target: { value: any; }; }) => {
    //   let inputValue = e.target.value
    //   setValue(inputValue)
    // }

    let onSelectedBlockchains = async function(inputs: any){
        try{
            console.log("input: onSelectedBlockchains: ",inputs)
            let blockchains:any = []
            for(let i = 0; i < inputs.length; i++){
                let input = inputs[i]
                blockchains.push(input.name.toLowerCase())
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


    let onRevokeEntry = async function(app:any){
        try{
            console.log("revoke entry: ",app)
            //submit as pioneer

            let payload = `{"type": "revoke", "app": "${app}"}`
            console.log("payload: ", entry);

            //
            let signature = await wallet.ethSignMessage({
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                message: payload,
            })
            const revoke: any = {};
            let addressInfo = {
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                coin: 'Ethereum',
                scriptType: 'ethereum',
                showDisplay: false
            }
            revoke.signer = await wallet.ethGetAddress(addressInfo);
            revoke.payload = payload;
            revoke.signature = signature.signature;
            if (!revoke.signer) throw Error("address required!");

            let resultWhitelist = await api.RevokeApp(revoke)
            console.log("resultWhitelist: ",resultWhitelist)


        }catch(e){
            console.error(e)
        }
    }

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose}
                   size='100px' >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Entry</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                            <FormLabel>Homepage URL</FormLabel>
                            <Input type='email' value={homepage} onChange={handleInputChangeApp} />
                            {!isError ? (
                                <FormHelperText>
                                    Homepage is the Landing, gernally designed to be indexed by crawlers.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>URL is required.</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError}>
                            <FormLabel>App URL</FormLabel>
                            <Input type='email' value={app} onChange={handleInputChangeApp} />
                            {!isError ? (
                                <FormHelperText>
                                    Enter the URL of the dapp application itself, gerneally app.serviceName*.com
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>URL is required.</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={isError}>
                            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                                {image && (
                                    <img src={image} alt="Image Preview" style={{ width: '100px', height: '100px' }} />
                                )}
                                <FormLabel>Image URL</FormLabel>
                                <Input type='email' value={image} onChange={handleInputChangeImage} />
                            </div>
                            {!isError ? (
                                <FormHelperText>
                                    Enter the URL of the image for the Dapp. This MUST be a valid URL and not an encoding!
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Image URL is required.</FormErrorMessage>
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
                                value={blockchainsSupported}
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
                                <Input
                                    type="text"
                                    name="twitter"
                                    value={socialMedia.twitter}
                                    onChange={handleSocialMediaChange}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl isInvalid={isError}>
                            <FormLabel>Social Media</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children="Telegram" />
                                <Input
                                    type="text"
                                    name="telegram"
                                    value={socialMedia.telegram}
                                    onChange={handleSocialMediaChange}
                                />
                            </InputGroup>
                        </FormControl>

                        <FormControl isInvalid={isError}>
                            <FormLabel>Social Media</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children="GitHub" />
                                <Input
                                    type="text"
                                    name="github"
                                    value={socialMedia.github}
                                    onChange={handleSocialMediaChange}
                                />
                            </InputGroup>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button onClick={onSubmitEdit} variant='green'>Submit changes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className="p-2">
                <table>
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="h-4" />
            </div>
            <Button onClick={onStart}>Refresh</Button>
        </div>
    );
};

export default ReviewDapps;
