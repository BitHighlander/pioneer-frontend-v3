import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Nodes</Heading>
        <br/>
        <Button colorScheme="blue" size="md">Add a node</Button>
    </Box>
);

const Nodes = () => {
    return (
        <Box>
            <Header />
        </Box>
    );
};

export default Nodes;
