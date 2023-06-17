import {
    Grid,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Textarea,
    ModalFooter,
    useDisclosure,
    Box,
    Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { usePioneer } from "lib/context/Pioneer";

const columnHelper = createColumnHelper<any>();

const WhitelistNodes = () => {
    const { state } = usePioneer();
    const { api, user, wallet } = state;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [value, setValue] = useState("");
    const [query, setQuery] = useState("bitcoin...");
    const [timeOut, setTimeOut] = useState(null);
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Update itemsPerPage to 20

    const editEntry = async function (name: string) {
        try {
            // open modal
            console.log("edit name: ", name);
            onOpen();
            const entry = data.filter(function (e) {
                return e.name === name;
            })[0];
            console.log("entry: ", entry);
            const prettyJson = JSON.stringify(entry, null, 2);
            setValue(prettyJson);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchData = async () => {
        try {
            const blockchains = await api.SearchBlockchainsPageniate({
                limit: itemsPerPage,
                skip: (currentPage - 1) * itemsPerPage,
            });
            console.log("blockchains: ", blockchains.data.length);
            console.log("blockchains: ", blockchains.data[0]);

            setData(blockchains.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const onStart = async () => {
            await fetchData();
        };

        onStart();
    }, []); // Run onStart only once on component mount

    const handleKeyPress = (event: any) => {
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

    const handleInputChange = (e: { target: { value: any } }) => {
        const inputValue = e.target.value;
        setValue(inputValue);
    };

    const onClear = async () => {
        setQuery("");
    };

    const search = async (query: string) => {
        console.log("query: ", query);
        let KeepKeyPage1 = await api.SearchByBlockchainName(query);
        console.log("KeepKeyPage1: ", KeepKeyPage1.data);
        setData(KeepKeyPage1.data);
    };

    const handlePaginationChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = (
                <Button
                    key={i}
                    onClick={() => handlePaginationChange(i)}
                    disabled={i === currentPage}
                    colorScheme={i === currentPage ? "blue" : undefined}
                    variant={i === currentPage ? "solid" : "outline"}
                    mx={1}
                >
                    {i}
                </Button>
            );
            // @ts-ignore
            pageNumbers.push(pageNumber);
        }

        return <div>{pageNumbers}</div>;
    };

    const onSubmitEdit = async function () {
        try {
            // Implementation for submitting edits
        } catch (e) {
            console.error(e);
        }
    };

    const table = useReactTable({
        data,
        columns: [
            columnHelper.accessor("image", {
                cell: (info) => (
                    <Image
                        src={info.getValue()}
                        alt="keepkey api"
                        objectFit="cover"
                        height="60px"
                        width="60px"
                        objectPosition="center"
                    />
                ),
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("blockchain", {
                cell: (info) => info.getValue(),
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("description", {
                cell: (info) => <a href={info.getValue()}>{info.getValue()}</a>,
                footer: (info) => info.column.id,
            }),
            columnHelper.accessor("name", {
                id: "edit",
                cell: (info) => (
                    <Button onClick={() => editEntry(info.getValue())}>Edit</Button>
                ),
                header: () => <span>edit</span>,
                footer: (info) => info.column.id,
            }),
        ],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose} size="100px">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Entry</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea
                            height="600px"
                            value={value}
                            onChange={handleInputChange}
                            placeholder="Here is a sample placeholder"
                            size="sm"
                        />
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
                <input
                    onFocus={onClear}
                    value={query}
                    onChange={handleKeyPress}
                    type="search"
                    style={{ border: "2px solid black", padding: "15px" }}
                />
            </Box>
            <div className="p-2">
                <table>
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="h-4" />
            </div>
            {renderPagination()}
        </div>
    );
};

export default WhitelistNodes;
