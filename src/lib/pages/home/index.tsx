import React from "react";
import {
    Box,
    Heading,
    Button,
} from "@chakra-ui/react";

const Header = () => (
    <Box p={5}>
        <Heading>Home</Heading>
        <br/>
        <Button colorScheme="blue" size="md">Become a Pioneer</Button>
    </Box>
);

const Home = () => {
    return (
        <Box>
            <Header />
        </Box>
    );
};

export default Home;
