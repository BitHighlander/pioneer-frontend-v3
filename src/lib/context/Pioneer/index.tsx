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
// import { KkRestAdapter } from "@keepkey/hdwallet-keepkey-rest";
// import { KeepKeySdk } from "@keepkey/keepkey-sdk";
// import { SDK } from "@pioneer-sdk/sdk";
// import * as core from "@shapeshiftoss/hdwallet-core";
import { KkRestAdapter } from "@keepkey/hdwallet-keepkey-rest";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import { SDK } from "@pioneer-sdk/sdk";

import * as core from "@shapeshiftoss/hdwallet-core";
// import * as keplr from "@shapeshiftoss/hdwallet-keplr";
import * as metaMask from "@shapeshiftoss/hdwallet-metamask";
import { NativeAdapter } from "@shapeshiftoss/hdwallet-native";
import { entropyToMnemonic } from "bip39";
import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
// import { v4 as uuidv4 } from "uuid";
// metmask
// keplr

// import { Keyring } from "@shapeshiftoss/hdwallet-core";

export enum WalletActions {
  SET_STATUS = "SET_STATUS",
  SET_USERNAME = "SET_USERNAME",
  SET_USER = "SET_WALLETS",
  SET_CONTEXT = "SET_CONTEXT",
  SET_BLOCKCHAIN = "SET_BLOCKCHAIN",
  SET_ASSET = "SET_ASSET",
  // SET_WALLETS = "SET_WALLETS",
  // SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  // INIT_PIONEER = "INIT_PIONEER",
  SET_API = "SET_API",
  SET_APP = "SET_APP",
  SET_WALLET = "SET_WALLET",
  RESET_STATE = "RESET_STATE",
}

export interface InitialState {
  // keyring: Keyring;
  status: any;
  username: string;
  serviceKey: string;
  queryKey: string;
  context: string;
  // balances: any[];
  // pubkeys: any[];
  // wallets: any[];
  // walletDescriptions: any[];
  // totalValueUsd: number;
  // app: any;
  user: any;
  wallet: any;
  app: any;
  api: any;
}

const initialState: InitialState = {
  // keyring: new Keyring(),
  status: "disconnected",
  username: "",
  serviceKey: "",
  queryKey: "",
  context: "",
  // balances: [],
  // pubkeys: [],
  // wallets: [],
  // walletDescriptions: [],
  // totalValueUsd: 0,
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
  // totalValueUsd: number | null;
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

export const PioneerProvider = ({
                                  children,
                                }: {
  children: React.ReactNode;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [username, setUsername] = useState<string | null>(null);
  // const [context, setContext] = useState<string | null>(null);
  // const [wallets, setSetWallets] = useState([]);
  const [context, setContext] = useState<string | null>(null);
  const [blockchainContext, setBlockchainContext] = useState<string | null>(
      null
  );
  const [assetContext, setAssetContext] = useState<string | null>(null);

  // connect KeepKey

  // connect metamask

  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log("onStart***** ");
      const serviceKey: string | null = localStorage.getItem("serviceKey"); // KeepKey api key
      let queryKey: string | null = localStorage.getItem("queryKey");
      let username: string | null = localStorage.getItem("username");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch({ type: WalletActions.SET_USERNAME, payload: username });
      // eslint-disable-next-line no-console
      console.log("username: ", username);

      const keyring = new core.Keyring();
      const metaMaskAdapter = metaMask.MetaMaskAdapter.useKeyring(keyring);
      const walletMetaMask = await metaMaskAdapter.pairDevice();
      if (walletMetaMask) {
        // pair metamask
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await walletMetaMask.initialize();
        // eslint-disable-next-line no-console
        console.log("walletMetaMask: ", walletMetaMask);
        console.log("ethAddress: ", walletMetaMask.ethAddress);
      }

      if (!queryKey) {
        queryKey = `key:${uuidv4()}`;
        localStorage.setItem("queryKey", queryKey);
      }
      if (!username) {
        username = `user:${uuidv4()}`;
        username = username.substring(0, 13);
        localStorage.setItem("username", username);
      }

      const blockchains = [
        "bitcoin",
        "ethereum",
        "thorchain",
        "bitcoincash",
        "litecoin",
        "binance",
        "cosmos",
        "dogecoin",
      ];

      // add custom paths
      const paths: any = [];
      const spec = "https://pioneers.dev/spec/swagger.json";
      const wss = "wss://pioneers.dev";
      // const spec = "http://127.0.0.1:9001/spec/swagger.json";
      // const wss = "ws://127.0.0.1:9001";
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
      // @ts-ignore
      const api = await appInit.init(walletMetaMask);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // // @ts-ignore
      // dispatch({ type: WalletActions.SET_WALLET, payload: walletMetaMask });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch({ type: WalletActions.SET_APP, payload: appInit });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch({ type: WalletActions.SET_API, payload: api });
      // @ts-ignore
      const user = await api.User();
      // eslint-disable-next-line no-console
      console.log("user: ", user);
      

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch({ type: WalletActions.SET_USER, payload: user.data });
      // setUsername(localStorage.getItem("username"));

      // eslint-disable-next-line no-console
      console.log("user.data.context: ", user.data.context);
      setContext(user.data.context);
      setBlockchainContext(user.data.blockchainContext);
      setAssetContext(user.data.assetContext);


      // eslint-disable-next-line react-hooks/rules-of-hooks
      const nativeAdapter = NativeAdapter.useKeyring(keyring);

      let hashStored = localStorage.getItem("hash");
      if(hashStored){
        const hashSplice = (str: string | any[] | null) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return str.slice(0, 34);
        };
        const hash = hashSplice(hashStored);
        //eslint-disable-next-line no-console
        console.log("hash (trimmed): ", hash);
        // get walletSoftware
        const walletSoftware = await nativeAdapter.pairDevice("testid");
        await nativeAdapter.initialize();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hashBytes = hash.replace("0x", "");
        // eslint-disable-next-line no-console
        console.log("hashBytes", hashBytes);
        // eslint-disable-next-line no-console
        console.log("hashBytes", hashBytes.length);
        const mnemonic = entropyToMnemonic(hashBytes.toString(`hex`));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await walletSoftware.loadDevice({ mnemonic });
        // eslint-disable-next-line no-console
        console.log("walletSoftware: ", walletSoftware);
        // eslint-disable-next-line no-console
        console.log("isInitialized: ", await walletSoftware?.isInitialized());
        // eslint-disable-next-line no-console
        console.log("getLabel: ", await walletSoftware?.getLabel());
        const successSoftware = await appInit.pairWallet(walletSoftware);
        // eslint-disable-next-line no-console
        console.log("successSoftware: ", successSoftware);
      }

      const config: any = {
        apiKey: serviceKey || "notSet",
        pairingInfo: {
          name: "ShapeShift",
          imageUrl: "https://assets.coincap.io/assets/icons/fox@2x.png",
          basePath: "http://localhost:1646/spec/swagger.json",
          url: "https://pioneer-template.vercel.com",
        },
      };
      const sdkKeepKey = await KeepKeySdk.create(config);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!config.apiKey !== serviceKey) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localStorage.setItem("serviceKey", config.apiKey);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const walletKeepKey = await KkRestAdapter.useKeyring(
        keyring
          // @ts-ignore
      ).pairDevice(sdkKeepKey);
      // eslint-disable-next-line no-console
      console.log("walletKeepKey: ", walletKeepKey);

      // pair keepkey
      const successKeepKey = await appInit.pairWallet(walletKeepKey);
      // eslint-disable-next-line no-console
      console.log("successKeepKey: ", successKeepKey);


      // eslint-disable-next-line no-console
      // console.log("user: ", user);
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

  return (
      <PioneerContext.Provider value={value}>{children}</PioneerContext.Provider>
  );
};

export const usePioneer = (): any =>
    useContext(PioneerContext as unknown as React.Context<IPioneerContext>);
