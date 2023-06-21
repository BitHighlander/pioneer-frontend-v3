import { CloseIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Tabs, TabList, TabPanels, Tab, TabPanel, Avatar, AvatarBadge, Box, Button, Flex, HStack, IconButton, Link, Menu, Image, MenuButton, MenuDivider, Icon, MenuItem, MenuList, Spacer, Text, useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, SimpleGrid, Card, CardHeader, Heading, CardBody, CardFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { KeepKeyIcon } from 'lib/assets/Icons/KeepKeyIcon';
import { KeplrIcon } from 'lib/assets/Icons/KeplrIcon';
import { MetaMaskIcon } from 'lib/assets/Icons/MetaMaskIcon';
import { TallyHoIcon } from 'lib/assets/Icons/TallyHoIcon';
import { XDEFIIcon } from 'lib/assets/Icons/XDEFIIcon';

// import type { ReactNode } from "react";
// import { KeepKeySdk } from "@keepkey/keepkey-sdk";
// @ts-ignore
import KEEPKEY_ICON from 'lib/assets/png/keepkey.png';
// @ts-ignore
import METAMASK_ICON from 'lib/assets/png/metamask.png';
// @ts-ignore
import PIONEER_ICON from 'lib/assets/png/pioneer.png';
// import Context from "lib/context";
import { usePioneer } from 'lib/context/Pioneer';

const getWalletType = (user: { walletDescriptions: any[]; }, context: any) => {
  if (user && user.walletDescriptions) {
    const wallet = user.walletDescriptions.find(w => w.id === context);
    return wallet ? wallet.type : null;
  }
  return null;
}

const getWalletBadgeContent = (walletType: string) => {
  const icons:any = {
    metamask: METAMASK_ICON,
    keepkey: KEEPKEY_ICON,
    native: PIONEER_ICON,
  };

  const icon = icons[walletType];

  if (!icon) {
    return <div />;
  }

  return (
      <AvatarBadge boxSize="1.25em" bg="green.500">
        <Image rounded="full" src={icon} />
      </AvatarBadge>
  );
}

const getWalletSettingsContent = (walletType: string) => {
  const icons:any = {
    metamask: METAMASK_ICON,
    keepkey: KEEPKEY_ICON,
    native: PIONEER_ICON,
  };

  const icon = icons[walletType];

  if (!icon) {
    return <div />;
  }

  return (
      icon
  );
}

const Header = () => {
  const { state, dispatch } = usePioneer();
  const { api, user, context, wallets } = state;
  const [placement, setPlacement] = useState('left')
  // let api = {}
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const navigationDisclosure = useDisclosure()
  const walletDisclosure = useDisclosure()
  // const [pioneerConnected, setPioneerConnected] = useState(false);

  // const [user, setUser] = useState({
  //   username: undefined,
  //   context: undefined,
  //   totalValueUsd: undefined,
  // });
  const [walletType, setWalletType] = useState("");
  const [walletDescriptions, setWalletDescriptions] = useState([]);
  const [walletsAvailable, setWalletsAvailable] = useState([]);
  const [balances, setBalances] = useState([]);
  const [metamaskPaired, setMetamaskPaired] = useState(false);
  const [keepkeyPaired, setKeepkeyPaired] = useState(false);
  const [nativePaired, setNativePaired] = useState(false);
  const [walletSettingsContext, setWalletSettingsContext] = useState('');
  const [assetContext, setAssetContext] = useState('');
  const [assetContextImage, setAssetContextImage] = useState('');
  const [blockchainContext, setBlockchainContext] = useState('');
  const [blockchainContextImage, setBlockchainContextImage] = useState('');
  // const [pubkeys, setPubkeys] = useState([]);
  // const [features, setKeepKeyFeatures] = useState({});

  const navigate = useNavigate();
  const handleToHome = () => navigate('/');

  const setContextWallet = async function (wallet: string) {
    try {
      // eslint-disable-next-line no-console
      console.log("wallets: ",wallets)
      const matchedWallet = wallets.find((w: { type: string; }) => w.type === wallet);

      if (matchedWallet) {
        dispatch({ type: 'SET_WALLET', payload: matchedWallet });
        dispatch({ type: 'SET_CONTEXT', payload: wallet });
      } else {
        console.log('No wallet matched the type of the context');
        //launch modal
        walletDisclosure.onOpen();
        setWalletSettingsContext(wallet);
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error('header e: ', e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const setContextBlockchain = async function (blockchain: string) {
    try {
      // eslint-disable-next-line no-console
      console.log('setContextBlockchain: ', blockchain);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error('header e: ', e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const setContextAsset = async function (asset: string) {
    try {
      // eslint-disable-next-line no-console
      console.log('setContextAsset: ', asset);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error('header e: ', e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  const onStart = async function () {
    try {
      // if(!wallet)
      //   await connect();
      // set color mode dark
      localStorage.setItem('chakra-ui-color-mode', 'dark');
      // eslint-disable-next-line no-console
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error('header e: ', e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  // // onStart()
  // useEffect(() => {
  //   setAssetContext(user.assetContext);
  //   // get images
  //   // eslint-disable-next-line no-console
  //   console.log("setAssetContext: USER: ", user);
  // }, [user, user?.assetContext]); // once on startup

  // onStart()
  useEffect(() => {
    onStart();
  }, [state, state.api]); // once on startup

  const setUser = async function () {
    try {
      if(user && user.wallets){
        const { wallets, walletDescriptions, balances, pubkeys } = user;
        // eslint-disable-next-line no-console
        console.log('wallets: ', wallets);

        for (let i = 0; i < walletDescriptions.length; i++) {
          const wallet = walletDescriptions[i];
          if (wallet.type === 'keepkey') {
            wallet.icon = KeepKeyIcon;
          }
          if (wallet.type === 'metamask') {
            setMetamaskPaired(true);
          }
          if (wallet.type === 'keepkey') {
            setKeepkeyPaired(true);
          }
          if (wallet.type === 'native') {
            setNativePaired(true);
          }
          wallet.paired = true;
          walletDescriptions[i] = wallet;
        }
        // eslint-disable-next-line no-console
        console.log('walletDescriptions: ', walletDescriptions);
        // setWalletsAvailable(walletsAvailable);
        setWalletDescriptions(walletDescriptions);
        setBalances(balances);
        // eslint-disable-next-line no-console
        console.log('walletsAvailable: ', walletsAvailable);

        // eslint-disable-next-line no-console
        console.log('balances: ', balances);

        // eslint-disable-next-line no-console
        console.log('pubkeys: ', pubkeys);
      }

    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console
      console.error('header e: ', e);
      // setKeepKeyError("Bridge is offline!");
    }
  };

  // onStart()
  useEffect(() => {
    setUser();
  }, [user]); // once on startup

  const handleNavigate = (route: string) => {
    navigate(route);
    navigationDisclosure.onClose();
  };

  useEffect(() => {
    if (context) {
      console.log('header context: ', context);
      setWalletType(context);
      // const { wallet, asset, blockchain } = context;
      // console.log('header context: ', context);
      // if (wallet) {
      //   setWalletType(wallet);
      // }
      // if (asset) {
      //   setAssetContext(asset);
      // }
      // if (blockchain) {
      //   setBlockchainContext(blockchain);
      // }
    }
  }, [context]);

  useEffect(() => {
    if (wallets) {
      setMetamaskPaired(!!wallets.find((w: { type: string; }) => w.type === "metamask"));
      setKeepkeyPaired(!!wallets.find((w: { type: string; }) => w.type === "keepkey"));
      setNativePaired(!!wallets.find((w: { type: string; }) => w.type === "native"));
    }
  }, [wallets]);

  const avatarContent = api ? getWalletBadgeContent(walletType) : (
      <AvatarBadge boxSize="1.25em" bg="red.500">
        <Image rounded="full" src={PIONEER_ICON} />  {/* Use the default icon here */}
      </AvatarBadge>
  );

  const toggleDrawer = () => {
    if (navigationDisclosure.isOpen) {
      navigationDisclosure.onClose()
    } else {
      navigationDisclosure.onOpen()
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
      <Flex as="header" width="full" alignSelf="flex-start" gridGap={2} alignItems="center">
        <Modal isOpen={walletDisclosure.isOpen} onClose={walletDisclosure.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Wallet Settings</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              {walletSettingsContext && (
                  <>
                    <Avatar size="xl" src={getWalletSettingsContent(walletSettingsContext)} />
                    <Box mt={4}>
                      {walletSettingsContext === 'keepkey' && (
                          <>
                            <Text>Status: Offline</Text>
                            <Button
                                colorScheme="green"
                                size="lg"
                                mb={2}
                                onClick={() => window.location.assign('keepkey://launch')}
                            >
                              Launch App
                            </Button>
                            <br/>
                            <Button
                                as={Link}
                                href="https://keepkey.com/get-started"
                                colorScheme="blue"
                                size="lg"
                                mt={2}
                            >
                              Go Get Started
                            </Button>
                          </>
                      )}
                    </Box>
                  </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={walletDisclosure.onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Drawer placement={'left'} onClose={navigationDisclosure.onClose} isOpen={navigationDisclosure.isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Navigation Options</DrawerHeader>
            <DrawerBody>
              <Button w="full" mb={2} onClick={() => handleNavigate('/dapps')}>
                Explore Dapps
              </Button>
              <Button w="full" mb={2} onClick={() => handleNavigate('/blockchains')}>
                Explore Blockchains
              </Button>
              <Button w="full" mb={2} onClick={() => handleNavigate('/assets')}>
                Explore Assets
              </Button>
              <Button w="full" mb={2} onClick={() => handleNavigate('/nodes')}>
                Explore Nodes
              </Button>
              <Button w="full" mb={2} onClick={() => handleNavigate('/become-pioneer')}>
                Become a Pioneer
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <IconButton
            size="md"
            icon={navigationDisclosure.isOpen ? <CloseIcon /> : <ArrowUpDownIcon />}
            aria-label={navigationDisclosure.isOpen ? "Close Menu" : "Open Menu"}
            onClick={toggleDrawer}
        />
        <HStack spacing={8}>
          <Link onClick={handleToHome}>
            <Box>Pioneer</Box>
          </Link>
        </HStack>
        <Spacer />
        <Menu>
          <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={200}>
            <Avatar size="lg" src={PIONEER_ICON}>
              {avatarContent}
            </Avatar>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <SimpleGrid columns={3} row={1}>
                <Card align="center" onClick={() => setContextWallet('native')}>
                  <CardBody>
                    <Avatar src={PIONEER_ICON}>
                      {nativePaired ? (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </div>
                      ) : (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                          </div>
                      )}
                    </Avatar>
                  </CardBody>
                  <small>Pioneer</small>
                </Card>
                <Card align="center" onClick={() => setContextWallet('metamask')}>
                  <CardBody>
                    <Avatar src={METAMASK_ICON}>
                      {metamaskPaired ? (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </div>
                      ) : (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                          </div>
                      )}
                    </Avatar>
                  </CardBody>
                  <small>MetaMask</small>
                </Card>
                <Card align="center" onClick={() => setContextWallet('keepkey')}>
                  <CardBody>
                    <Avatar src={KEEPKEY_ICON}>
                      {keepkeyPaired ? (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </div>
                      ) : (
                          <div>
                            <AvatarBadge boxSize="1.25em" bg="red.500" />
                          </div>
                      )}
                    </Avatar>
                  </CardBody>
                  <small>KeepKey</small>
                </Card>
              </SimpleGrid>
            </MenuItem>
            <Tabs>
              <TabList>
                <Tab>Dashboard</Tab>
                <Tab>Balances</Tab>
                <Tab>Pubkeys</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  context: {context}
                  <br/>
                </TabPanel>
                <TabPanel>
                  <Accordion defaultIndex={[0]} allowMultiple>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            Balances {balances.length}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {balances.map((balance: any) => (
                            <div>
                              <Avatar size="sm" src={balance.image} />
                              <small>symbol: {balance.symbol}</small>
                              <small>balance: {balance.balance}</small>
                            </div>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MenuList>
        </Menu>
      </Flex>
  );
};

export default Header;
