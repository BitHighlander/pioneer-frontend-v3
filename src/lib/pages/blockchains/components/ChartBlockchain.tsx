import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button
} from '@chakra-ui/react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers'
// import { useAlert } from 'react-alert'
import { usePioneer } from 'lib/context/Pioneer';
// @ts-ignore
import Client from '@pioneer-platform/pioneer-client'


const SubmitBlockchains = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const [name, setName] = React.useState('')
    const [app, setApp] = React.useState('')
    const [image, setImage] = React.useState('')

    const handleInputChangeName = (e:any) => setName(e.target.value)
    const handleInputChangeApp = (e:any) => setApp(e.target.value)
    const handleInputChangeImage = (e:any) => setImage(e.target.value)


    // const isError = input === ''
    const isError = false

    let onSubmit = async function(){
        try{
            console.log("name: ",name)
            console.log("app: ",app)
            console.log("image: ",image)

            let dapp:any = {}
            dapp.name = name
            dapp.app = app
            dapp.image = image
            dapp.tags = ['ethereum']


            let payload:any = {
                name,
                app
            }
            payload = JSON.stringify(payload)
            
            const addressInfo = {
                addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                coin: 'Ethereum',
                scriptType: 'ethereum',
                showDisplay: false,
            };
            const address = await wallet.ethGetAddress(addressInfo);
            const update: any = {};

            if(!address) throw Error("Onbord not setup! no address ")
            const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
            const signer = ethersProvider.getSigner()
            let signature = await signer.signMessage(payload)
            dapp.protocol  = ['wallet-connect-v1']
            dapp.version = "wc-1"
            dapp.developer = address.toLowerCase()
            dapp.signer = address.toLowerCase()
            dapp.payload = payload
            dapp.signature = signature

            // let txInfo = await pioneer.ChartDapp({},dapp)
            // console.log("SUCCESS: ",txInfo.data)

        }catch(e){
            console.error(e)
        }
    }

    return (
        <div>
            <FormControl isInvalid={isError}>
                <FormLabel>Name</FormLabel>
                <Input type='email' value={name} onChange={handleInputChangeName} />
                {!isError ? (
                    <FormHelperText>
                        Enter the name of the blockchain.
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>blockchain is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={isError}>
                <FormLabel>Explorer URL</FormLabel>
                <Input type='email' value={app} onChange={handleInputChangeApp} />
                {!isError ? (
                    <FormHelperText>
                        Enter the URL of the explorer
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
                        Enter the URL of image for the blockchain
                    </FormHelperText>
                ) : (
                    <FormErrorMessage>image URL is required.</FormErrorMessage>
                )}
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
    );
};

export default SubmitBlockchains;
