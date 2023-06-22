import React from 'react';
import { Avatar, Box, Flex, Heading } from '@chakra-ui/react';
import StarRating from './StarRating';

interface StarRatingProps {
  rating: number;
  setRating: any;
  count?: number;
  size?: number;
}

interface ReviewProps extends StarRatingProps {
  name: string;
  avatar: string;
  text: string;
}

export default function Review({ name, rating, avatar, text, setRating }: ReviewProps) {
  return (
    <Box mb={4}>
      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Heading as="h4" size="md">
            {name}
          </Heading>
          <StarRating rating={rating} size={24} setRating={setRating} />
        </Box>
        <Box>
          <Avatar src={avatar} />
        </Box>
      </Flex>
      <Box mt={2}>{text}</Box>
    </Box>
  );
}
