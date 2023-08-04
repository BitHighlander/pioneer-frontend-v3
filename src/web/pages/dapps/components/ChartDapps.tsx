import { Text, Checkbox, Box, Spinner, CardBody, Card, Grid, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, useDisclosure } from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState, useMemo } from 'react';
import { usePioneer } from 'web/context/Pioneer';
// @ts-ignore
import { DappModal } from 'web/components/modals/DappModal';

const columnHelper = createColumnHelper<any>();

const ChartDapps = () => {
  const { state } = usePioneer();
  const { api, wallet } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [timeOut, setTimeOut] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [value, setValue] = useState({});
  const itemsPerPage = 10;

  const columns = useMemo(
      () => [
        columnHelper.accessor('image', {
          cell: (info) => (info.getValue() ? <Image src={info.getValue()} alt="keepkey api" objectFit="cover" height="60px" width="60px" objectPosition="center" /> : null),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor('name', {
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
          // @ts-ignore
          sortType: 'alphanumeric', // Enable sorting in ascending and descending order
        }),
        columnHelper.accessor('app', {
          cell: (info) => (
              <div style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <a href={info.getValue()}>{info.getValue()}</a>
              </div>
          ),
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor('name', {
          id: 'edit',
          cell: (info) => <Button onClick={() => editEntry(info.getValue())}>Edit</Button>,
          header: () => <span>edit</span>,
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor('name', {
          id: 'approve',
          cell: (info) => <Button onClick={() => whitelistEntry(info.getValue())}>approve</Button>,
          header: () => <span>approve</span>,
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor('name', {
          id: 'reject',
          cell: (info) => (
              <Button colorScheme="red" onClick={() => rejectEntry(info.row.original.app)}>
                reject
              </Button>
          ),
          header: () => <span>reject</span>,
          footer: (info) => info.column.id,
        }),
      ],
      []
  );

  const editEntry = async function (name: string) {
    try {
      console.log('edit name: ', name);
      onOpen();
      // @ts-ignore
      const entry = data.find((e) => e.name === name);
      console.log('edit entry: ', entry);
      // @ts-ignore
      setValue(entry);
      // console.log('entry: ', entry);
      // const prettyJson = JSON.stringify(entry, null, 2);
      // setValue(prettyJson);
    } catch (e) {
      console.error(e);
    }
  };

  const rejectEntry = async function (app: string) {
    try {
      console.log('revoke entry: ', app);
      const payload = `{"type": "revoke", "app": "${app}"}`;
      console.log('payload: ', payload);

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

      const resultWhitelist = await api.RevokeApp(revoke);
      console.log('resultWhitelist: ', resultWhitelist);

      onStart();
    } catch (e) {
      console.error(e);
    }
  };

  const whitelistEntry = async function (name: any) {
    try {
      console.log('whitelist name: ', name);
      // @ts-ignore
      const entry = data.find((e) => e.name === name);
      console.log('whitelist entry: ', entry);

      // @ts-ignore
      const payload = `{"type": "dapp", "name": "${name}", "url": "${entry.app}"}`;
      console.log('payload: ', entry);

      const signature = await wallet.ethSignMessage({
        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
        message: payload,
      });
      const whitelist: any = {};
      const addressInfo = {
        addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
        coin: 'Ethereum',
        scriptType: 'ethereum',
        showDisplay: false,
      };
      whitelist.signer = await wallet.ethGetAddress(addressInfo);
      whitelist.payload = payload;
      whitelist.signature = signature.signature;
      if (!whitelist.signer) throw Error('address required!');

      console.log('whitelist: ', whitelist);
      const resultWhitelist = await api.WhitelistApp(whitelist);
      console.log('resultWhitelist: ', resultWhitelist.data);

      if (resultWhitelist.data.success) {
        console.log('SUCCESS: ', resultWhitelist.data);
        alert('SUCCESS! app added to store');
        onStart();
      } else {
        console.error('error: ', resultWhitelist);
        alert('User is not a pioneer!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSortBy = (columnName) => {
    if (sortBy === columnName) {
      // If already sorted by the same column, toggle the sorting order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new column, set it as the sortBy parameter and default to ascending order
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const onStart = async function () {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      let params = {
        limit: itemsPerPage,
        skip: skip,
        sortBy: sortBy,
        sortOrder: sortOrder,
        customFilters: {
          whitelist: false,
        }
      }
      console.log("params: ",params)
      const response = await api.ListAppsSearch(params);
      const { results, total } = response.data;
      console.log("results: ", results)
      console.log("total: ", total)
      const totalPages = Math.ceil(total / itemsPerPage);
      setTotalPages(totalPages);

      setData(results);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [api]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePaginationChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onStart();
  };

  const search = async (query) => {
    console.log('query: ', query);
    const KeepKeyPage1 = await api.SearchByBlockchainName(query);
    console.log('KeepKeyPage1: ', KeepKeyPage1.data);
    setData(KeepKeyPage1.data);
  };
  
  const onClear = () => {
    setQuery('');
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


  if (!api) {
    return <Spinner size="xl" />;
  }

  // @ts-ignore
  return (
      <Card w="1300px" justifyContent="left">
        <CardBody>
          <DappModal isOpen={isOpen} onClose={onClose} value={value} />
          <div className="p-2">
            <Box>
              <Text>Search:</Text>
              <input onFocus={onClear} value={query} onChange={handleKeyPress} type="search" style={{ border: '2px solid black', padding: '15px' }} />
            </Box>
            <table>
              <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                  </tr>
              ))}
              </thead>
              <tbody>
              {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
              ))}
              </tbody>
            </table>
            <div className="h-4" />
          </div>
          <br />
          <Button onClick={onStart}>Refresh</Button>
          <div>
            {totalPages > 0 && (
                <div>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <Button
                          key={pageNumber}
                          onClick={() => handlePaginationChange(pageNumber)}
                          disabled={pageNumber === currentPage}
                          colorScheme={pageNumber === currentPage ? 'blue' : undefined}
                          variant={pageNumber === currentPage ? 'solid' : 'outline'}
                          mx={1}
                      >
                        {pageNumber}
                      </Button>
                  ))}
                </div>
            )}
          </div>
        </CardBody>
      </Card>
  );
};

export default ChartDapps;
