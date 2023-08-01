import React, { useState } from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';

const Receive = () => {
    const [address, setAddress] = useState('');

    return (
        <>
            <FormControl>
                <FormLabel>Address:</FormLabel>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </FormControl>

            {address && (
                <>
                    <Text mt={4}>QR Code:</Text>
                    <QRCode value={address} size={128} />
                    <Text mt={2}>{address}</Text>
                </>
            )}
        </>
    );
};

export default Receive;
