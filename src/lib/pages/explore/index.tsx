import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

const Header = () => (
    <Box p={5}>
        <Heading>Explore the worlds of blockchains</Heading>
        <br />
    </Box>
);

const Pioneer = () => {
    return (
        <Box>
            <Header />
        </Box>
    );
};

export default Pioneer;
