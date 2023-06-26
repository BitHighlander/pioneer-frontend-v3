import React, { useState, useEffect } from 'react';
import {
  Checkbox,
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

const WhitelistNodes = () => {
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
  const [sortField, setSortField] = useState('chainId'); // New state variable for sorting

  const columns = React.useMemo(
      () => [
        {
          Header: 'Image',
          accessor: 'image',
          Cell: ({ value }) => (
              <div style={{ width: '60px' }}>
                <Image src={value} alt="keepkey api" boxSize="40px" borderRadius="full" />
              </div>
          ),
          width: 60, // Adjust the width as needed
          style: { minWidth: '60px' },
        },
        {
          Header: 'Blockchain',
          accessor: 'blockchain',
          Cell: ({ value }) => (
              <div style={{ width: '120px' }}>
                {value}
              </div>
          ),
          style: { minWidth: '120px' },
        },
        {
          Header: 'Service',
          accessor: 'service',
          Cell: ({ value }) => (
              <div style={{ width: '220px' }}>
                <small>{value}</small>
              </div>
          ),
        },
        {
          Header: 'ChainID',
          accessor: 'chainId',
          Cell: ({ value }) => (
              <div style={{ width: '20px' }}>
                {value}
              </div>
          ),
        },
        {
          Header: 'Pair',
          accessor: 'pair',
          Cell: ({ value }) => (
              <div style={{ width: '80px' }}>
                <Button color={'green'} onClick={() => pairNetwork(value)}>Pair</Button>
              </div>
          ),
        },
        {
          Header: 'Edit',
          accessor: 'exit',
          Cell: ({ value }) => (
              <div style={{ width: '80px' }}>
                <Button onClick={() => editEntry(value)}>Edit</Button>
              </div>
          ),
        },
        {
          Header: 'Delete',
          accessor: 'delete',
          Cell: ({ value }) => (
              <div style={{ width: '80px' }}>
                <Button colorScheme="red" onClick={() => deleteEntry(value)}>Delete</Button>
              </div>
          ),
        },
      ],
      []
  );



  const tableInstance = useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [{ id: 'chainId', desc: false }], // Default sorting by 'blockchain' in ascending order
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
    const sortField = columnId || 'chainId'; // Get the sort field
    setSortField(sortField); // Update the sort field state
    const sortOrder = sortBy[0].id === columnId && !sortBy[0].desc ? -1 : 1; // Get the sort order

    tableInstance.setSortBy([{ id: sortField, desc: sortOrder === -1 }]); // Update the sort state
    setCurrentPage(1); // Reset the current page
    fetchData();
  };


  const fetchData = async () => {
    try {
      if (api) {
        const sortOrder = sortBy[0].desc ? -1 : 1; // Get the current sort order
        let payload = {
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
          sortField: sortField, // Set sortField to 'chainId' if currently sorting by 'chainId'
          sortOrder,
          searchBy: sortField, // Set searchBy to 'blockchain' if query is present, otherwise use the current sortField
        }
        console.log("payload: ", payload)
        const blockchains = await api.SearchNodes({limit:1000,skip:0});

        // Set the data to the table
        setData(blockchains.data);

        // Update the total blockchains count
        setTotalBlockchains(1000);
      }
    } catch (e) {
      console.error(e);
    }
  };


  useEffect(() => {
    fetchData();
  }, [api]);

  const pairNetwork = async (name) => {
    try {
      onOpen();
      console.log("name: ",name)
    } catch (e) {
      console.error(e);
    }
  };

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
            <Box>
              <Checkbox defaultChecked>web3 (EIP155)</Checkbox>
              <br/>
              <Checkbox defaultChecked>blockbook (indexed)</Checkbox>
              <br/>
              <Checkbox defaultChecked>cosmosSDK (tendermint)</Checkbox>
            </Box>
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

export default WhitelistNodes;
