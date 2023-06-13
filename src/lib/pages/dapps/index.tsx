import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Dapps</Heading>
        <br/>
        <Button colorScheme="blue" size="md">Chart a dapp</Button>
    </Box>
);

const Dapps = () => {
    return (
        <Box>
            <Header />
        </Box>
    );
};

export default Dapps;
