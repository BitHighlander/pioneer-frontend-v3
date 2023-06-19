import {
    Grid,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
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
import { useEffect } from "react";
import {Select as SelectImported} from "chakra-react-select";
const columnHelper = createColumnHelper<any>()
import { usePioneer } from 'lib/context/Pioneer';

const ReviewDapps = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const alert = useAlert()

    const [votedUpNames, setVotedUpNames] = React.useState(() => [])
    const [votedDownNames, setVotedDownNames] = React.useState(() => [])
    const [data, setData] = React.useState(() => [])

    const [name, setName] = React.useState('')
    const [app, setApp] = React.useState('')
    const [image, setImage] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [minVersion, setMinVersion] = React.useState([])
    const [blockchains, setBlockchains] = React.useState([])
    const [protocolsSupported, setProtocolsSupported] = React.useState([])
    const [featuresSupported, setFeaturesSupported] = React.useState([])
    const [entry, setEntry] = React.useState(null)
    const [isRest, setIsRest] = React.useState(false)
    const [blockchainsSupported, setBlockchainsSupported] = React.useState([])
    const handleInputChangeName = (e:any) => setName(e.target.value)
    const handleInputChangeApp = (e:any) => setApp(e.target.value)
    const handleInputChangeImage = (e:any) => setImage(e.target.value)
    const handleInputChangeMinVersion = (e:any) => setMinVersion(e.target.value)
    const handleInputChangeDescription = (e:any) => setDescription(e.target.value)
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
            cell: info => <Button onClick={() => editEntry(info.getValue())}>Edit</Button>,
            header: () => <span>edit</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('revoke', {
            id: 'revoke',
            cell: info => <Button colorScheme='red' onClick={() => onRevokeEntry(info.getValue())}>revoke</Button>,
            header: () => <span>edit</span>,
            footer: info => info.column.id,
        }),
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

    let editEntry = async function(name:string){
        try{

            // let blockchains = await api.SearchBlockchainsPaginate({limit:1000,skip:0})
            // blockchains = blockchains.data
            // console.log("blockchains: ",blockchains.length)
            // let blockchainsFormated:any = []
            // for(let i = 0; i < blockchains.length; i++){
            //     let blockchain = blockchains[i]
            //     blockchain.value = blockchain.name.toLowerCase()
            //     blockchain.label = blockchain.name.toLowerCase()
            //     blockchainsFormated.push(blockchain)
            // }
            // console.log("blockchainsFormated: ",blockchainsFormated.length)
            // setBlockchains(blockchainsFormated)


        }catch(e){
            console.error(e)
        }
    }

    let onSubmitEdit = async function(){
        try{
            console.log("onSubmitEdit: ")
            const updateEntity = async (entryKey, newValue, action = null, type = null) => {
                // @ts-ignore
                if (entry[entryKey] !== newValue) {
                    console.log(`${entryKey} has changed!`)
                    let diff = {
                        name,
                        key: entryKey,
                        value: newValue,
                    }
                    if (type) { // @ts-ignore
                        diff.type = type;
                    }
                    if (action) { // @ts-ignore
                        diff.action = action;
                    }

                    let payload = JSON.stringify(diff)
                    if (!wallet || !wallet.provider) throw Error("Onbord not setup!")

                    let messageToSign = entryKey === 'image' ? "updated image" : payload;
                    let signature = await wallet.ethSignMessage({
                        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                        message: messageToSign,
                    })
                    let address = wallet?.accounts[0]?.address
                    let update: any = {};
                    update.name = name;
                    update.signer = address;
                    update.payload = payload;
                    update.signature = signature.signature;
                    if (entryKey === 'image') {
                        update.imageData = newValue;
                    }

                    if (!address) throw Error("address required!");

                    console.log("update: ", update);
                    let resultUpdate = await api.UpdateApp(update);
                    console.log("resultUpdate: ", resultUpdate);
                }
            }

            try {
                await updateEntity("name", name);
                await updateEntity("app", app);
                await updateEntity("image", image);
                await updateEntity("description", description);
                // @ts-ignore
                await updateEntity("blockchains", blockchainsSupported, "replace", "array");
                // @ts-ignore
                await updateEntity("protocols", protocolsSupported, "replace", "array");
                // @ts-ignore
                await updateEntity("features", featuresSupported, "replace", "array");

            } catch(e) {
                console.error("e: ",e)
            }
        }catch(e){
            console.error(e)
        }
    }

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


    let onRevokeEntry = async function(entry:any){
        try{

            //submit as admin
            // console.log("update: ",update)
            // let resultWhitelist = await api.RevokeApp("",update)
            // console.log("resultWhitelist: ",resultWhitelist)


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
                        {isRest ? <div>
                            <FormControl isInvalid={isError}>
                                <FormLabel>Minimum Version Requirements</FormLabel>
                                <Input type='email' value={minVersion} onChange={handleInputChangeMinVersion} />
                                {!isError ? (
                                    <FormHelperText>
                                        (REST ONLY) Enter the VERSION of keepkey-desktop required for the dapp to work.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>min version is required.</FormErrorMessage>
                                )}
                            </FormControl>
                        </div>:<div></div>}
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
