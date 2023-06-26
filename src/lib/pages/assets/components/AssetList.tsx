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
import SubmitAssetsForm from './AssetForm';

const AssetsList = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const [value, setValue] = useState('');
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalAssets, setTotalAssets] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [timeOut, setTimeOut] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null); // New state variable for selected asset
    const [sortField, setSortField] = useState('rank'); // New state variable for sorting

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
                Header: 'Rank',
                accessor: 'rank',
            },
            {
                Header: 'Description',
                accessor: 'description',
                Cell: ({ value }) => <a href={value}>{value}</a>,
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
                accessor: 'name', // Access the 'name' property of the row
                Cell: ({ value }) => <Button onClick={() => editEntry(value)}>Edit</Button>, // Pass the 'name' as a parameter to editEntry
            },
            {
                Header: 'Delete',
                accessor: 'delete', // Unique accessor for the Delete column
                Cell: ({ row }) => <Button colorScheme="red" onClick={() => deleteEntry(row.original.name)}>Delete</Button>, // Pass the 'name' as a parameter to deleteEntry
            },
        ],
        []
    );

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [{ id: 'rank', desc: false }], // Default sorting by 'rank' in ascending order
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
        const newSortField = columnId || 'rank';
        const sortOrder = sortBy[0].id === newSortField && !sortBy[0].desc ? -1 : 1;

        tableInstance.setSortBy([{ id: newSortField, desc: sortOrder === -1 }]);
        setCurrentPage(1);
        setSortField(newSortField); // Update the state variable with the new sort field
        fetchData(newSortField, sortOrder);
    };

    const fetchData = async (sortField?: string, sortOrder?: number, filterTags?: any) => {
        try {
            if (api) {
                console.log("fetchData: ")
                if (!sortField) sortField = 'rank';
                if (!sortOrder) sortOrder = 1;
                if (!filterTags) filterTags = [];
                const payload = {
                    sortBy: sortField,
                    limit: itemsPerPage,
                    skip: (currentPage - 1) * itemsPerPage,
                    sortOrder: sortOrder === -1 ? 'desc' : 'asc',
                    filterTags: filterTags,
                };
                console.log("payload: ", payload)
                const assets = await api.GetAssets(payload);

                setData(assets.data.assets);
                setTotalAssets(assets.data.total);
            }
        } catch (e) {
            // Handle error
            console.error(e)
        }
    };
    let onStart = async function(){
        console.log("onStart: ")
        fetchData();
    }

    useEffect(() => {
        onStart()
    }, [api]);

    const editEntry = async (name) => {
        try {
            console.log("editEntry: ", name)
            onOpen();

            // @ts-ignore
            const entry = data.filter((e) => e.name === name)[0];
            // @ts-ignore
            setSelectedAsset(entry)

        } catch (e) {
            console.error(e);
        }
    };

    const deleteEntry = async (app) => {
        try {
            if(wallet){
                // Add your delete logic here
                console.log('revoke entry: ', app);
                //submit as pioneer

                const payload = `{"type": "revoke", "app": "${app}"}`;
                console.log('payload: ', payload);

                //
                console.log("wallet: ",wallet)
                const signature = await wallet.ethSignMessage({
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    message: payload,
                });
                const revoke: any = {};
                const addressInfo = {
                    addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
                    coin: 'Ethereum',
                    scriptType: 'ethereum',
                    showDisplay: false,
                };
                revoke.signer = await wallet.ethGetAddress(addressInfo);
                revoke.payload = payload;
                revoke.signature = signature.signature;
                if (!revoke.signer) throw Error('address required!');

                const resultWhitelist = await api.DeleteAsset(revoke);
                console.log('resultWhitelist: ', resultWhitelist);
                setTimeout(() => {
                    fetchData();
                }, 2000);
            } else {
                console.log("wallet not connected")
            }

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
        fetchData(sortField, sortBy[0].desc ? -1 : 1);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalAssets / itemsPerPage);
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
                <Text>{`Total Assets: ${totalAssets}`}</Text>
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

    if (!api || !wallet) {
        return <Spinner size="xl" />;
    }

    return (
        <Card w="1300px" justifyContent="left">
            <Modal onClose={onClose} isOpen={isOpen} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Asset</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedAsset && (
                            <SubmitAssetsForm
                                initialAsset={selectedAsset}
                                onSubmit={onSubmitEdit}
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
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
            <Button onClick={onStart}>Refresh</Button>
        </Card>
    );
};

export default AssetsList;
