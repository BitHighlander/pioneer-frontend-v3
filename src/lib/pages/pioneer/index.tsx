import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Pioneers.dev</Heading>
        <br/>
        <Button colorScheme="blue" size="md">Become a Pioneer</Button>
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
