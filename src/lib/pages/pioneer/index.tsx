import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Profile Page</Heading>
        <br/>
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
