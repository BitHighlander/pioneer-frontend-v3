import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Image,
  Stack,
  StackDivider,
  Heading,
  Card,
  CardHeader,
  CardBody,
  useDisclosure
} from '@chakra-ui/react';
import { usePioneer } from 'lib/context/Pioneer';
import { useTable, useSortBy } from 'react-table';

const WhitelistBlockchains = () => {
  const { state } = usePioneer();
  const { api } = state;
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalBlockchains, setTotalBlockchains] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeOut, setTimeOut] = useState(null);
  const columns = React.useMemo(
      () => [
        {
          Header: 'Image',
          accessor: 'image',
          Cell: ({ value }) => <Image src={value} alt="keepkey api" boxSize="40px" borderRadius="full" />,
        },
        {
          Header: 'Blockchain',
          accessor: 'blockchain',
        },
        {
          Header: 'Description',
          accessor: 'description',
          Cell: ({ value }) => <a href={value}>{value}</a>,
        },
        {
          Header: 'Chain ID',
          accessor: 'chainId',
        },
        {
          accessor: 'caip',
          Cell: ({ value }) => (
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: 200, maxHeight: '100px', overflowY: 'auto' }}>
                {value}
              </div>
          ),
          Footer: () => 'caip',
          // Adjust the width value as needed
        },
        {
          Header: 'Edit',
          accessor: 'exit',
          Cell: ({ value }) => <Button onClick={() => editEntry(value)}>Edit</Button>,
        },
        {
          Header: 'Delete',
          accessor: 'delete',
          Cell: ({ value }) => <Button colorScheme="red" onClick={() => deleteEntry(value)}>Delete</Button>,
        },
      ],
      []
  );

  const tableInstance = useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [{ id: 'blockchain', desc: false }], // Default sorting by 'blockchain' in ascending order
        },
      },
      useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = tableInstance;

  const handleClickedSortBy = (columnId) => {
    console.log("columnId: ", columnId)
    const sortField = columnId || 'blockchain'; // Get the sort field
    const sortOrder = sortBy[0].id === columnId && !sortBy[0].desc ? -1 : 1; // Get the sort order

    tableInstance.setSortBy([{ id: sortField, desc: sortOrder === -1 }]); // Update the sort state
    setCurrentPage(1); // Reset the current page
    fetchData();
  };


  const fetchData = async () => {
    try {
      if (api) {
        const sortField = sortBy[0].id || 'blockchain'; // Get the current sort field
        const sortOrder = sortBy[0].desc ? -1 : 1; // Get the current sort order
        const searchBy = query || 'blockchain'; // Default to searching by 'blockchain'
        let payload = {
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
          sortField,
          sortOrder,
          searchBy,
        }
        console.log("payload: ", payload)
        const blockchains = await api.SearchBlockchainsPageniate(payload);

        // Set the data to the table
        setData(blockchains.data.blockchains);

        // Update the total blockchains count
        setTotalBlockchains(blockchains.data.total);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  const editEntry = async (name) => {
    try {
      onOpen();
      // @ts-ignore
      const entry = data.filter((e) => e.name === name)[0];
      const prettyJson = JSON.stringify(entry, null, 2);
      setValue(prettyJson);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEntry = async (name) => {
    try {
      // Add your delete logic here
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyPress = (event) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    const inputValue = event.target.value;
    setQuery(inputValue);
    setTimeOut(
        // @ts-ignore
        setTimeout(() => {
          search(inputValue);
        }, 1000)
    );
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  const onClear = () => {
    setQuery('');
  };

  const search = async (query) => {
    console.log('query: ', query);
    const KeepKeyPage1 = await api.SearchByBlockchainName(query);
    console.log('KeepKeyPage1: ', KeepKeyPage1.data);
    setData(KeepKeyPage1.data);
  };

  const handlePaginationChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData();
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalBlockchains / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        const pageNumber = (
            <Button
                key={i}
                onClick={() => handlePaginationChange(i)}
                disabled={i === currentPage}
                colorScheme={i === currentPage ? 'blue' : undefined}
                variant={i === currentPage ? 'solid' : 'outline'}
                mx={1}
            >
              {i}
            </Button>
        );
        // @ts-ignore
        pageNumbers.push(pageNumber);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        // @ts-ignore
        pageNumbers.push(<Text mx={1} key={i}>...</Text>);
      }
    }

    return (
        <Box mt={4} textAlign="center">
          <Text>{`Total blockchains: ${totalBlockchains}`}</Text>
          <Stack direction="row" spacing={2} mt={2}>
            {pageNumbers}
          </Stack>
        </Box>
    );
  };

  const onSubmitEdit = async () => {
    try {
      // Implementation for submitting edits
    } catch (e) {
      console.error(e);
    }
  };

  if (!api) {
    return <Spinner size="xl" />;
  }

  return (
      <Card w="1300px" justifyContent="left">
        <CardBody>
          <Box>
            <Text>Search:</Text>
            <input onFocus={onClear} value={query} onChange={handleKeyPress} type="search" style={{ border: '2px solid black', padding: '15px' }} />
          </Box>
          <Box w="1200px" mt={9} overflowX="auto" justifyContent="center">
            <Table {...getTableProps()}>
              <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} style={{ borderBottom: '2px solid black' }}>
                      {headerGroup.headers.map((column) => (
                          <Th
                              key={column.id}
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                              onClick={() => handleClickedSortBy(column.id)} // Use column.id instead of column
                              style={{ padding: '10px', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }}
                          >
                            {column.render('Header')}
                            {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                          </Th>
                      ))}
                    </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                      <Tr key={row.id} {...row.getRowProps()} style={{ borderBottom: '1px solid black' }}>
                        {row.cells.map((cell) => (
                            <Td key={cell.id} {...cell.getCellProps()} style={{ padding: '10px' }}>
                              {cell.render('Cell')}
                            </Td>
                        ))}
                      </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
          {renderPagination()}
        </CardBody>
      </Card>
  );
};

export default WhitelistBlockchains;
