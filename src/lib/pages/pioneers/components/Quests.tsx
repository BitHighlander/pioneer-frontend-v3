import React, { useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Avatar, Heading, Button } from '@chakra-ui/react';
import { usePioneer } from 'lib/context/Pioneer';

const Quests = () => {
  const { state } = usePioneer();
  const { api, user, wallet } = state;

  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Box>
        <Heading>Quests</Heading>
        <div></div>
      </Box>
    </Box>
  );
};

export default Quests;
