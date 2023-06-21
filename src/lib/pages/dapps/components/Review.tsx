import React from "react";
import { Avatar, Box, Flex, Heading } from "@chakra-ui/react";
import StarRating from "./StarRating";

interface StarRatingProps {
    rating: number;
    setRating: (rating: number) => void;
    count?: number;
    size?: number;
}

interface ReviewProps {
    name: string;
    rating: number;
    avatar: string;
    text: string;
}


export default function Review({ name, rating, avatar, text }: ReviewProps) {
    return (
        <Box mb={4}>
            <Flex alignItems="center" justifyContent="space-between">
                <Box>
                    <Heading as="h4" size="md">
                        {name}
                    </Heading>
                    <StarRating rating={rating} size={24} setRating={function (rating: number): void {
                        throw new Error("Function not implemented.");
                    }} />
                </Box>
                <Box>
                    <Avatar src={avatar} />
                </Box>
            </Flex>
            <Box mt={2}>{text}</Box>
        </Box>
    );
}
