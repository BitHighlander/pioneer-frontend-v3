import React, { useState, useEffect } from 'react';
import { Card, Button, FormControl, FormLabel, Input, Spinner, Avatar } from '@chakra-ui/react';
import { usePioneer } from "web/context/Pioneer";

const Send = (Asset:any) => {
    const { state, dispatch } = usePioneer();
    const { user, app, api, wallet } = state;
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [blockchain, setBlockchain] = useState('');
    const [caip, setCaip] = useState(null);
    const [txid, setTxid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        try {
            setIsLoading(true);
            console.log("Asset: ", Asset.asset);
            console.log("Address: ", address);
            console.log("amount: ", amount);
            const ASSET = Asset.asset.symbol;
            if(!address) alert("Must set an address!")
            if(!amount) alert("Must set an amount!")
            const send:any = {
                blockchain: blockchain,
                network: Asset.asset.network,
                asset: Asset.asset.symbol,
                balance: Asset.asset.balance,
                address,
                amount,
                noBroadcast: false,
            };
            if(Asset.asset.contract) send.contract = Asset.asset.contract;
            const tx = {
                type: "sendToAddress",
                payload: send,
            };
            console.log("tx: ", tx);
            let invocation = await app.build(tx);
            console.log("invocation: ", invocation);
            // sign
            invocation = await app.sign(invocation, wallet);
            console.log("invocation: ", invocation);
            invocation.network = ASSET //TODO dont do this bullshit, use caip
            invocation.noBroadcast = false
            invocation.sync = true
            invocation = await app.broadcast(invocation);
            console.log("invocation: ", invocation);
            if(invocation && invocation.broadcast && invocation.broadcast.txid){
                setIsLoading(false);
                setTxid(invocation.broadcast.txid);
                //TODO open block explorer link
                //window.open('https://example.com', '_blank'); // Open link in a new tab
            }

        } catch (error) {
            console.error(error);
        }
    };

    //onStart get balance of asset
    //get max amount able to send
    const onStart = async () => {
        try {
            console.log("Asset: ", Asset.asset.caip);
            console.log("Asset: ", Asset.asset);
            setCaip(Asset.asset.caip)
            setBalance(Asset.asset.balance)
            
            //get asset by caip
            let asset = await api.AssetByCaip({caip:Asset.asset.caip})
            console.log("asset: ",asset.data)
            console.log("asset: ",asset.data[0].blockchain)
            setBlockchain(asset.data[0].blockchain)
            //@ts-ignore
            if(!asset.data[0].blockchain) Alert("unknown asset! ciap: "+Asset.asset.caip)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        onStart(); // Call the onStart function when the component mounts
    }, []);
    
    return (
        <Card>
            <h2>Balance: {balance}</h2>
            <Avatar src={Asset.asset.image}></Avatar>
            <small>caip: {caip}</small>
            <br/>
            {txid ? (<div>
                txid: <small> {txid} </small>
                <Button>view on block explorer</Button>
            </div>) : (<div>
                <FormControl>
                    <FormLabel>Amount:</FormLabel>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Address:</FormLabel>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </FormControl>

                <Button mt={4} colorScheme="blue" onClick={handleSend}>
                    {isLoading ? <Spinner /> : 'Send'}
                </Button>
            </div>)}
        </Card>
    );
};

export default Send;
