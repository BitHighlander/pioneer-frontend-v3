/* eslint-disable no-await-in-loop */
import { Grid, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, useDisclosure } from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import { usePioneer } from 'lib/context/Pioneer';
const columnHelper = createColumnHelper<any>();

const WhitelistDapps = () => {
  const { state } = usePioneer();
  const { api, user, wallet } = state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = React.useState('');
  // const alert = useAlert()
  const [data, setData] = React.useState([]);

  const columns = [
    columnHelper.accessor('image', {
      cell: (info) => (info.getValue() ? <Image src={info.getValue()} alt="keepkey api" objectFit="cover" height="60px" width="60px" objectPosition="center" /> : null),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
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
  ];

  const editEntry = async function (name: string) {
    try {
      // open modal
      console.log('edit name: ', name);
      onOpen();
      const entry = data.filter(function (e) {
        // @ts-ignore
        return e.name === name;
      })[0];
      console.log('entry: ', entry);
      const prettyJson = JSON.stringify(entry, null, 2);
      setValue(prettyJson);
    } catch (e) {
      console.error(e);
    }
  };

  const rejectEntry = async function (app: string) {
    try {
      // open modal
      console.log('revoke entry: ', app);
      //submit as pioneer

      const payload = `{"type": "revoke", "app": "${app}"}`;
      console.log('payload: ', payload);

      //
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
      //sign
    } catch (e) {
      console.error(e);
    }
  };

  const whitelistEntry = async function (name: any) {
    try {
      // open modal
      console.log('whitelist name: ', name);
      const entry = data.filter(function (e) {
        // @ts-ignore
        return e.name === name;
      })[0];
      console.log('whitelist entry: ', entry);

      // @ts-ignore
      const payload = `{"type": "dapp", "name": "${name}", "url": "${entry.app}"}`;
      console.log('payload: ', entry);

      //
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

      //if not pioneer show Call to action
      if (resultWhitelist.data.success) {
        //show success message
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

  const onSubmitEdit = async function () {
    try {
      // try {
      //     const diffJson = (
      //         obj1: { [x: string]: any },
      //         obj2: { [x: string]: any }
      //     ) => {
      //         const diffArray = [];
      //         for (const key in obj1) {
      //             if (obj2[key] !== undefined && typeof obj2[key] !== "object") {
      //                 if (obj1[key] !== obj2[key]) {
      //                     diffArray.push({
      //                         key,
      //                         value: obj2[key],
      //                     });
      //                 }
      //             }
      //         }
      //         return diffArray;
      //     };
      //     value = JSON.parse(value);
      //     // entry DB
      //     const entry = data.filter(function (e) {
      //         // @ts-ignore
      //         return e.name === value.name;
      //     })[0];
      //     console.log("entry: ", entry);
      //     // @ts-ignore
      //     const diffs = diffJson(entry, value);
      //
      //     for (let i = 0; i < diffs.length; i++) {
      //         const diff: any = diffs[i];
      //         // @ts-ignore
      //         diff.name = value.name;
      //         const payload = JSON.stringify(diff);
      //
      //         if (!wallet || !wallet.provider) throw Error("Onbord not setup!");
      //         const ethersProvider = new ethers.providers.Web3Provider(
      //             wallet.provider,
      //             "any"
      //         );
      //         const signer = ethersProvider.getSigner();
      //         const signature = await signer.signMessage(payload);
      //         const address = wallet?.accounts[0]?.address;
      //         const update: any = {};
      //         update.signer = address;
      //         update.payload = payload;
      //         update.signature = signature;
      //         if (!address) throw Error("address required!");
      //         // submit as admin
      //         console.log("update: ", update);
      //         const resultWhitelist = await pioneer.UpdateApp("", update);
      //         console.log("resultWhitelist: ", resultWhitelist);
      //     }
      // } catch (e) {
      //     // alert invalid JSON!
      //     console.error("e: ", e);
      // }
    } catch (e) {
      console.error(e);
    }
  };

  const onStart = async function () {
    try {
      // get all unapproved dapps
      const apps = await api.ListAppsPending({ limit: 1000, skip: 0 });
      console.log('apps: ', apps.data.length);
      console.log('apps: ', apps.data[0]);
      // setData
      setData(apps.data);
    } catch (e) {
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const handleInputChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <div>
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
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
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
    </div>
  );
};

export default WhitelistDapps;
