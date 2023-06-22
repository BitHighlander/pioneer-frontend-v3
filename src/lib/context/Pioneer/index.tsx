/*
    Pioneer SDK

        A ultra-light bridge to the pioneer platform

              ,    .  ,   .           .
          *  / \_ *  / \_      .-.  *       *   /\'__        *
            /    \  /    \,   ( ₿ )     .    _/  /  \  *'.
       .   /\/\  /\/ :' __ \_   -           _^/  ^/    `--.
          /    \/  \  _/  \-'\      *    /.' ^_   \_   .'\  *
        /\  .-   `. \/     \ /==~=-=~=-=-;.  _/ \ -. `_/   \
       /  `-.__ ^   / .-'.--\ =-=~_=-=~=^/  _ `--./ .-'  `-
      /        `.  / /       `.~-^=-=~=^=.-'      '-._ `._

                             A Product of the CoinMasters Guild
                                              - Highlander
  
    Wallet Providers:
    
    1. Metmask:
      if metamask derivice pioneer seed from metamask
      
    2. keepkey:
      If keepkey detected: use it, otherwise use the native adapter
      
    3. Native Adapter:
        If no wallets, use the native adapter
  


      Api Docs:
        * https://pioneers.dev/docs/
      Transaction Diagram
        * https://github.com/BitHighlander/pioneer/blob/master/docs/pioneerTxs.png
  
*/
import { KkRestAdapter } from '@keepkey/hdwallet-keepkey-rest';
import { KeepKeySdk } from '@keepkey/keepkey-sdk';
import { SDK } from '@pioneer-sdk/sdk';
import * as core from '@shapeshiftoss/hdwallet-core';
// import * as keplr from "@shapeshiftoss/hdwallet-keplr";
import * as metaMask from '@shapeshiftoss/hdwallet-metamask';
import { NativeAdapter } from '@shapeshiftoss/hdwallet-native';
import { entropyToMnemonic } from 'bip39';
import { createContext, useReducer, useContext, useMemo, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export enum WalletActions {
  SET_STATUS = 'SET_STATUS',
  SET_USERNAME = 'SET_USERNAME',
  SET_USER = 'SET_WALLETS',
  SET_CONTEXT = 'SET_CONTEXT',
  SET_BLOCKCHAIN = 'SET_BLOCKCHAIN',
  SET_ASSET = 'SET_ASSET',
  // SET_WALLETS = "SET_WALLETS",
  // SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  // INIT_PIONEER = "INIT_PIONEER",
  SET_API = 'SET_API',
  SET_APP = 'SET_APP',
  SET_WALLET = 'SET_WALLET',
  ADD_WALLET = 'ADD_WALLET',
  RESET_STATE = 'RESET_STATE',
}

export interface InitialState {
  // keyring: Keyring;
  status: any;
  username: string;
  serviceKey: string;
  queryKey: string;
  context: string;
  balances: any[];
  pubkeys: any[];
  wallets: any[];
  walletDescriptions: any[];
  totalValueUsd: number;
  // app: any;
  user: any;
  wallet: any;
  app: any;
  api: any;
}

const initialState: InitialState = {
  // keyring: new Keyring(),
  status: 'disconnected',
  username: '',
  serviceKey: '',
  queryKey: '',
  context: '',
  balances: [],
  pubkeys: [],
  wallets: [],
  walletDescriptions: [],
  totalValueUsd: 0,
  // app: {} as any,
  user: null,
  wallet: null,
  app: null,
  api: null,
};

export interface IPioneerContext {
  state: InitialState;
  username: string | null;
  context: string | null;
  status: string | null;
  totalValueUsd: number | null;
  user: any;
  wallet: any;
  app: any;
  api: any;
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.SET_USERNAME; payload: string }
  | { type: WalletActions.SET_WALLET; payload: any }
  | { type: WalletActions.SET_APP; payload: any }
  | { type: WalletActions.SET_API; payload: any }
  | { type: WalletActions.SET_USER; payload: any }
  | { type: WalletActions.SET_CONTEXT; payload: any }
  | { type: WalletActions.ADD_WALLET; payload: any }
  // | { type: WalletActions.SET_WALLET_DESCRIPTIONS; payload: any }
  // | { type: WalletActions.INIT_PIONEER; payload: boolean }
  | { type: WalletActions.RESET_STATE };

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      return { ...state, status: action.payload };
    case WalletActions.SET_CONTEXT:
      return { ...state, context: action.payload };
    case WalletActions.SET_USERNAME:
      return { ...state, username: action.payload };
    case WalletActions.SET_WALLET:
      return { ...state, wallet: action.payload };
    case WalletActions.ADD_WALLET:
      return { ...state, wallets: [...state.wallets, action.payload] };
    case WalletActions.SET_APP:
      return { ...state, app: action.payload };
    case WalletActions.SET_API:
      return { ...state, api: action.payload };
    case WalletActions.SET_USER:
      return { ...state, user: action.payload };
    case WalletActions.RESET_STATE:
      return {
        ...state,
        api: null,
        user: null,
        username: null,
        context: null,
        status: null,
      };
    default:
      return state;
  }
};

const PioneerContext = createContext(initialState);

export const PioneerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [username, setUsername] = useState<string | null>(null);
  // const [context, setContext] = useState<string | null>(null);
  const [wallets, setSetWallets] = useState([]);
  const [context, setContext] = useState<string | null>(null);
  const [blockchainContext, setBlockchainContext] = useState<string | null>(null);
  const [assetContext, setAssetContext] = useState<string | null>(null);

  // connect KeepKey

  // connect metamask

  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log('onStart***** ');
      const serviceKey: string | null = localStorage.getItem('serviceKey'); // KeepKey api key
      let queryKey: string | null = localStorage.getItem('queryKey');
      let username: string | null = localStorage.getItem('username');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch({ type: WalletActions.SET_USERNAME, payload: username });
      // eslint-disable-next-line no-console
      console.log('username: ', username);

      interface Window {
        ethereum?: any; // Customize the type if needed
      }

      const isMetaMaskAvailable = (): boolean => {
        return (window as any).ethereum !== undefined && (window as any).ethereum.isMetaMask;
      };

      const keyring = new core.Keyring();
      const metaMaskAdapter = metaMask.MetaMaskAdapter.useKeyring(keyring);
      console.log('metaMaskAdapter: ', metaMaskAdapter);

      if (!queryKey) {
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem('queryKey', queryKey);
      }
      if (!username) {
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        localStorage.setItem('username', username);
      }

      const blockchains = ['bitcoin', 'ethereum', 'thorchain', 'bitcoincash', 'litecoin', 'binance', 'cosmos', 'dogecoin'];

      // add custom paths
      const paths: any = [];
      // @ts-ignore
      const spec = import.meta.env.VITE_PIONEER_URL_SPEC || 'https://pioneers.dev/spec/swagger.json';
      // @ts-ignore
      const wss = import.meta.env.VITE_PIONEER_URL_WS || 'wss://pioneers.dev';
      const configPioneer: any = {
        blockchains,
        username,
        queryKey,
        spec,
        wss,
        paths,
      };
      // console.log("pioneerApi: ",pioneerApi)
      const appInit = new SDK(spec, configPioneer);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment

      // Example usage
      let walletMetaMask;
      if (isMetaMaskAvailable()) {
        walletMetaMask = await metaMaskAdapter.pairDevice();
        if (walletMetaMask) {
          // pair metamask
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await walletMetaMask.initialize();
          // eslint-disable-next-line no-console
          console.log('walletMetaMask: ', walletMetaMask);
          console.log('ethAddress: ', walletMetaMask.ethAddress);
          // @ts-ignore
          dispatch({ type: WalletActions.ADD_WALLET, payload: walletMetaMask });
        }
      } else {
        console.log('MetaMask is not available');
      }

      const checkKeepkeyAvailability = async () => {
        try {
          const response = await fetch('http://localhost:1646/spec/swagger.json');
          if (response.status === 200) {
            return true;
          }
        } catch (error) {
          return false;
        }
        return false;
      };

      const isKeepkeyAvailable = await checkKeepkeyAvailability();

      let walletKeepKey;
      if (isKeepkeyAvailable) {
        //is keepkey available
        const config: any = {
          apiKey: serviceKey || 'notSet',
          pairingInfo: {
            name: 'ShapeShift',
            imageUrl: 'https://assets.coincap.io/assets/icons/fox@2x.png',
            basePath: 'http://localhost:1646/spec/swagger.json',
            url: 'https://pioneer-template.vercel.com',
          },
        };
        const sdkKeepKey = await KeepKeySdk.create(config);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!config.apiKey !== serviceKey) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          localStorage.setItem('serviceKey', config.apiKey);
        }

        walletKeepKey = await KkRestAdapter.useKeyring(
          keyring
          // @ts-ignore
        ).pairDevice(sdkKeepKey);
        // eslint-disable-next-line no-console
        console.log('walletKeepKey: ', walletKeepKey);

        // pair keepkey
        const successKeepKey = await appInit.pairWallet(walletKeepKey);
        // eslint-disable-next-line no-console
        console.log('successKeepKey: ', successKeepKey);
        // @ts-ignore
        dispatch({ type: WalletActions.ADD_WALLET, payload: walletKeepKey });
      }

      let walletSoftware;
      let mnemonic;
      let hashStored;
      let hash;
      const nativeAdapter = NativeAdapter.useKeyring(keyring);
      //is metamask available AND no KeepKey
      if (walletMetaMask && !isKeepkeyAvailable) {
        //generate software from metamask
        hashStored = localStorage.getItem('hash');
        if (!hashStored) {
          //generate from MM
          const message = 'Pioneers:0xD9B4BEF9:gen1';
          const { hardenedPath, relPath } = walletMetaMask.ethGetAccountPaths({
            coin: 'Ethereum',
            accountIdx: 0,
          })[0];
          const sig = await walletMetaMask.ethSignMessage({
            addressNList: hardenedPath.concat(relPath),
            message,
          });
          // @ts-ignore
          console.log('sig: ', sig.signature);
          // @ts-ignore
          localStorage.setItem('hash', sig.signature);
          // @ts-ignore
          hashStored = sig.signature;
        }
        console.log('hashStored: ', hashStored);
        const hashSplice = (str: string | any[] | null) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return str.slice(0, 34);
        };
        // @ts-ignore
        hash = hashSplice(hashStored);
        // eslint-disable-next-line no-console
        console.log('hash (trimmed): ', hash);
        // @ts-ignore
        const hashBytes = hash.replace('0x', '');
        console.log('hashBytes', hashBytes);
        console.log('hashBytes', hashBytes.length);
        mnemonic = entropyToMnemonic(hashBytes.toString(`hex`));

        // get walletSoftware
        walletSoftware = await nativeAdapter.pairDevice('testid');
        await nativeAdapter.initialize();
        // @ts-ignore
        await walletSoftware.loadDevice({ mnemonic });
        const successSoftware = await appInit.pairWallet(walletSoftware);
        console.log('successSoftware: ', successSoftware);
        // @ts-ignore
        dispatch({ type: WalletActions.ADD_WALLET, payload: walletSoftware });
      }

      //if NO metamask AND NO KeepKey then generate new seed
      if (!walletMetaMask && !isKeepkeyAvailable && !walletSoftware) {
        //generate new seed
        //@TODO
        alert('No wallets found! unable to continue');
      } else {
        //prefure KeepKey
        const walletPreferred = walletKeepKey || walletMetaMask || walletSoftware;
        // @ts-ignore
        console.log('walletPreferred: ', walletPreferred.type);
        // @ts-ignore
        const api = await appInit.init(walletPreferred);
        // @ts-ignore
        dispatch({ type: WalletActions.SET_CONTEXT, payload: walletPreferred.type });
        // setSetWallets(wallets.push(walletMetaMask))
        // @ts-ignore
        dispatch({ type: WalletActions.SET_WALLET, payload: walletPreferred });
        // @ts-ignore
        dispatch({ type: WalletActions.SET_APP, payload: appInit });
        // @ts-ignore
        dispatch({ type: WalletActions.SET_API, payload: api });
        // @ts-ignore
        const user = await api.User();
        // eslint-disable-next-line no-console
        console.log('user: ', user);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch({ type: WalletActions.SET_USER, payload: user.data });
        // setUsername(localStorage.getItem("username"));

        // eslint-disable-next-line no-console
        console.log('user.data.context: ', user.data.context);
        //@TODO move context back to lable of wallet not wallet type
        // setContext(user.data.context);
        // let context = user.data.context;
        // let walletContext = user.data.walletDescriptions.filter(context);

        setBlockchainContext(user.data.blockchainContext);
        setAssetContext(user.data.assetContext);
        // eslint-disable-next-line no-console
        // console.log("user: ", user);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  // end
  const value: any = useMemo(() => ({ state, dispatch }), [state]);

  return <PioneerContext.Provider value={value}>{children}</PioneerContext.Provider>;
};

export const usePioneer = (): any => useContext(PioneerContext as unknown as React.Context<IPioneerContext>);
