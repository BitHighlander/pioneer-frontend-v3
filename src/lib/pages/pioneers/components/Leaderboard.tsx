import React, { useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Avatar, Heading, Button } from '@chakra-ui/react';
import { usePioneer } from 'lib/context/Pioneer';

const Leaderboard = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;

    const [data, setData] = React.useState([]);

    // @ts-ignore
    const columns = React.useMemo(
        () => [
            {
                Header: 'Avatar',
                accessor: 'avatar',
                // @ts-ignore
                Cell: ({ value }) => <Avatar size="2xl" name={null} src={value} />,
            },
            // {
            //     Header: 'Username',
            //     accessor: 'username',
            // },
            {
                Header: 'Scores',
                accessor: 'score',
            },
            {
                Header: 'Vote Power',
                accessor: 'power',
            },
            {
                Header: 'Public Address',
                accessor: 'address',
            },
        ],
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const devs = await api.ListDevelopers({ limit: 1000, skip: 0 });
                setData(devs.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [api]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    return (
        <>
            <Table {...getTableProps()} variant="simple">
                <Thead>
                    {headerGroups.map(headerGroup => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
            <Box>
                <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </Button>
                <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </Button>
                <Button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </Button>
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </Button>
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
            </Box>
        </>
    );
};

export default Leaderboard;
