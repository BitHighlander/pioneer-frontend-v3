import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Blockchains</Heading>
        <br/>
        <Button colorScheme="blue" size="md">Chart a Blockchain</Button>
    </Box>
);

const Blockchains = () => {
    return (
        <Box>
            <Header />
        </Box>
    );
};

export default Blockchains;
