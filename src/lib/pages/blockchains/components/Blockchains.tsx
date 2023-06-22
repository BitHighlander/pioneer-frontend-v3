import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Spinner, Grid, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Textarea, ModalFooter, useDisclosure, Box, Text } from '@chakra-ui/react';
import { usePioneer } from 'lib/context/Pioneer';

const WhitelistBlockchains = () => {
  const { state } = usePioneer();
  const { api, user, wallet } = state;
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalBlockchains, setTotalBlockchains] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeOut, setTimeOut] = useState(null); // Add this line
  const columns = React.useMemo(
      () => [
        {
          accessor: 'image',
          Cell: ({ value }) => <Image src={value} alt="keepkey api" objectFit="cover" height="60px" width="60px" objectPosition="center" />,
          Footer: () => 'image',
        },
        {
          accessor: 'blockchain',
          Cell: ({ value }) => value,
          Footer: () => 'blockchain',
        },
        {
          accessor: 'description',
          Cell: ({ value }) => <a href={value}>{value}</a>,
          Footer: () => 'description',
        },
        {
          accessor: 'chainId',
          Cell: ({ value }) => value,
          Footer: () => 'chainId',
        },
        {
          accessor: 'caip',
          Cell: ({ value }) => value,
          Footer: () => 'caip',
        },
        {
          id: 'edit',
          accessor: 'name',
          Cell: ({ value }) => <Button onClick={() => editEntry(value)}>Edit</Button>,
          Header: 'edit',
          Footer: () => 'edit',
        },
        {
          id: 'delete',
          accessor: 'name',
          Cell: ({ value }) => <Button colorScheme="red" onClick={() => deleteEntry(value)}>Delete</Button>,
          Header: 'delete',
          Footer: () => 'delete',
        },
      ],
      []
  );
  const tableInstance = useTable(
      {
        columns,
        data,
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
  const fetchData = async () => {
    try {
      if(api){
        const sortBy = tableInstance.state.sortBy[0] || {};
        const sortField = sortBy.id || 'name'; // Default to sorting by 'name'
        const searchBy = query || 'name'; // Default to searching by 'name'
        const blockchains = await api.SearchBlockchainsPageniate({
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
          sortField,
          sortOrder: sortBy.desc ? -1 : 1,
          searchBy,
        });

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
    const onStart = async () => {
      await fetchData();
    };
    onStart();
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

  const onClear = async () => {
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
    fetchData()
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
        <div>
          <Text>{`Total blockchains: ${totalBlockchains}`}</Text>
          <div>{pageNumbers}</div>
        </div>
    );
  };

  const onSubmitEdit = async () => {
    try {
      // Implementation for submitting edits
    } catch (e) {
      console.error(e);
    }
  };
  

  return (
      <div>
        {api ? (
            <>
              <Modal isOpen={isOpen} onClose={onClose} size="100px">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Edit Entry</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Textarea height="600px" value={value} onChange={handleInputChange} placeholder="Here is a sample placeholder" size="sm" />
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button onClick={onSubmitEdit} variant="green">
                      Submit changes
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Box>
                <Text>Search:</Text>
                <input onFocus={onClear} value={query} onChange={handleKeyPress} type="search" style={{ border: '2px solid black', padding: '15px' }} />
              </Box>
              <div className="p-2">
                <table {...getTableProps()}>
                  <thead>
                  {headerGroups.map((headerGroup) => (
                      <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                              {column.render('Header')}
                            </th>
                        ))}
                      </tr>
                  ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr key={row.id} {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                              <td key={cell.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          ))}
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
                <div className="h-4">
                  <Box>
                    <Button onClick={fetchData}>Refresh</Button>
                  </Box>
                </div>
              </div>
              {renderPagination()}
            </>
        ) : (
            <Spinner size="xl" />
        )}
      </div>
  );
};

export default WhitelistBlockchains;
