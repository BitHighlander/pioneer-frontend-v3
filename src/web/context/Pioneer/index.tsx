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
import { KkRestAdapter } from "@keepkey/hdwallet-keepkey-rest";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import { SDK } from "@pioneer-sdk/sdk";
import * as core from "@shapeshiftoss/hdwallet-core";
// import * as keplr from "@shapeshiftoss/hdwallet-keplr";
import * as metaMask from "@shapeshiftoss/hdwallet-metamask";
import type { NativeHDWallet } from "@shapeshiftoss/hdwallet-native";
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
  SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  ADD_WALLET = "ADD_WALLET",
  RESET_STATE = "RESET_STATE",
  PAIR_WALLET = "PAIR_WALLET",
  SWITCH_WALLET = "SWITCH_WALLET",
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
  status: "disconnected",
  username: "",
  serviceKey: "",
  queryKey: "",
  context: "",
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
    | { type: WalletActions.SET_WALLET_DESCRIPTIONS; payload: any }
    | { type: WalletActions.SET_APP; payload: any }
    | { type: WalletActions.SET_API; payload: any }
    | { type: WalletActions.SET_USER; payload: any }
    | { type: WalletActions.SET_CONTEXT; payload: any }
    | { type: WalletActions.ADD_WALLET; payload: any }
    // | { type: WalletActions.SET_WALLET_DESCRIPTIONS; payload: any }
    // | { type: WalletActions.INIT_PIONEER; payload: boolean }
    | { type: WalletActions.RESET_STATE }
    | { type: WalletActions.PAIR_WALLET; payload: any } // New action type for pairing a wallet
    | { type: WalletActions.SWITCH_WALLET; payload: any }; // New action type for switching the active wallet


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
    case WalletActions.SET_WALLET_DESCRIPTIONS:
      return { ...state, walletDescriptions: action.payload };
    case WalletActions.ADD_WALLET:
      return { ...state, wallets: [...state.wallets, action.payload] };
    case WalletActions.SET_APP:
      return { ...state, app: action.payload };
    case WalletActions.SET_API:
      return { ...state, api: action.payload };
    case WalletActions.SET_USER:
      return { ...state, user: action.payload };
    case WalletActions.PAIR_WALLET:
      return { ...state, wallets: action.payload };
    case WalletActions.SWITCH_WALLET:
      return { ...state, wallet: action.payload };
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
  const [wallets, setWallets] = useState([]);
  const [walletDescriptions, setWalletDescriptions] = useState([]);
  const [context, setContext] = useState<string | null>(null);
  const [blockchainContext, setBlockchainContext] = useState<string | null>(
      null
  );
  const [assetContext, setAssetContext] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // New pairWallet function
  const pairWallet = async (wallet: any) => {
    // Call the API to pair the wallet
    // For example: await appInit.pairWallet(wallet);
    console.log("pairWallet called!")
    // Dispatch the action to update the state with the new wallet
    // @ts-ignore
    dispatch({ type: WalletActions.PAIR_WALLET, payload: wallet });
  };

  // New switchWallet function
  const switchWallet = async (wallet: any) => {
    // Call the API or perform any necessary operations to switch the active wallet
    // For example: await appInit.switchWallet(wallet);
    console.log("switchWallet called!")
    // Dispatch the action to update the state with the switched wallet
    // @ts-ignore
    dispatch({ type: WalletActions.SWITCH_WALLET, payload: wallet });
  };


  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log("onStart***** ");
      const serviceKey: string | null = localStorage.getItem("serviceKey"); // KeepKey api key
      let queryKey: string | null = localStorage.getItem("queryKey");
      let username: string | null = localStorage.getItem("username");
      // @ts-ignore
      dispatch({ type: WalletActions.SET_USERNAME, payload: username });
      console.log("username: ", username);

      interface Window {
        ethereum?: any; // Customize the type if needed
      }

      const isMetaMaskAvailable = (): boolean => {
        return (
            (window as any).ethereum !== undefined &&
            (window as any).ethereum.isMetaMask
        );
      };

      const keyring = new core.Keyring();
      const metaMaskAdapter = metaMask.MetaMaskAdapter.useKeyring(keyring);
      console.log("metaMaskAdapter: ", metaMaskAdapter);

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
      // @ts-ignore
      const spec = import.meta.env.VITE_PIONEER_URL_SPEC ||
          "https://pioneers.dev/spec/swagger.json";
      console.log("spec: ", spec);
      // @ts-ignore
      const wss = import.meta.env.VITE_PIONEER_URL_WS || "wss://pioneers.dev";
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
      let walletMetaMask: metaMask.MetaMaskHDWallet | undefined;
      if (isMetaMaskAvailable()) {
        console.log("isMetaMaskAvailable ")
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
          dispatch({type: WalletActions.ADD_WALLET, payload: walletMetaMask});

          //listen for address chain

        }
      } else {
        console.log('MetaMask is not available');
      }

      const checkKeepkeyAvailability = async () => {
        try {
          const response = await fetch(
              "http://localhost:1646/spec/swagger.json"
          );
          if (response.status === 200) {
            return true;
          }
        } catch (error) {
          return false;
        }
        return false;
      };

      const isKeepkeyAvailable = await checkKeepkeyAvailability();

      let walletKeepKey: core.HDWallet;
      if (isKeepkeyAvailable) {
        // is keepkey available
        const config: any = {
          apiKey: serviceKey || "notSet",
          pairingInfo: {
            name: "Pioneer",
            imageUrl: "https://i.imgur.com/BdyyJZS.png",
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

        walletKeepKey = await KkRestAdapter.useKeyring(
            keyring
            // @ts-ignore
        ).pairDevice(sdkKeepKey);
        // eslint-disable-next-line no-console
        console.log("walletKeepKey: ", walletKeepKey);

        // pair keepkey
        const successKeepKey = await appInit.pairWallet(walletKeepKey);
        // eslint-disable-next-line no-console
        console.log("successKeepKey: ", successKeepKey);
        // @ts-ignore
        dispatch({ type: WalletActions.ADD_WALLET, payload: walletKeepKey });
      }

      let walletSoftware: NativeHDWallet | null;

      // if NO metamask AND NO KeepKey then generate new seed
      // @ts-ignore
      if (!walletMetaMask && !isKeepkeyAvailable && !walletSoftware) {
        // generate new seed
        // @TODO
        alert("No wallets found! unable to continue");
      } else {
        // prefure KeepKey
        // @ts-ignore
        const walletPreferred = walletKeepKey || walletMetaMask || walletSoftware;
        // @ts-ignore
        console.log("walletPreferred: ", walletPreferred.type);

        // get pubkeys
        // const pubkeys = await appInit.getPubkeys(walletPreferred);
        // console.log("pubkeys: ", pubkeys);

        // @ts-ignore
        // await appInit.refresh()
        // @ts-ignore
        dispatch({
          type: WalletActions.SET_CONTEXT,
          // @ts-ignore
          payload: walletPreferred.type,
        });
        // setSetWallets(wallets.push(walletMetaMask))
        // @ts-ignore
        dispatch({ type: WalletActions.SET_WALLET, payload: walletPreferred });

        // now pair the rest
        // @ts-ignore
        // if (walletKeepKey) {
        //   const successKeepKey = await appInit.pairWallet(walletKeepKey);
        //   console.log("successKeepKey: ", successKeepKey);
        // }
        if (walletMetaMask) {
          console.log("walletMetaMask found: ",walletMetaMask)
          const successMetaMask = await appInit.pairWallet(walletMetaMask);
          console.log("successMetaMask: ", successMetaMask);
        }
        // // @ts-ignore
        // if (walletSoftware) {
        //   const successnative = await appInit.pairWallet(walletSoftware);
        //   console.log("successnative: ", successnative);
        // }

        // @ts-ignore
        const api = await appInit.init(walletPreferred);
        console.log("api: ", api);

        // @ts-ignore
        if(api){
          // @ts-ignore
          dispatch({ type: WalletActions.SET_APP, payload: appInit });
          // @ts-ignore
          dispatch({ type: WalletActions.SET_API, payload: api });

          // @ts-ignore
          const user = await api.User();
          // eslint-disable-next-line no-console
          console.log("user: ", user.data);

          const events = await appInit.startSocket();
          console.log("events: ", events);

          events.on("message", (event: any) => {
            console.log("event: ", event);
          });

          events.on("blocks", (event: any) => {
            console.log("event: ", event);
          });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dispatch({ type: WalletActions.SET_USER, payload: user.data });
          // setUsername(localStorage.getItem("username"));

          // eslint-disable-next-line no-console
          console.log("user.data.context: ", user.data.context);
          // @TODO move context back to lable of wallet not wallet type
          // setContext(user.data.context);
          // let context = user.data.context;
          // let walletContext = user.data.walletDescriptions.filter(context);

          //set wallets
          if (user.data.wallets) setWallets(user.data.wallets);
          if (user.data.walletDescriptions)
            setWalletDescriptions(user.data.walletDescriptions);

          if (user.data.blockchainContext)
            setBlockchainContext(user.data.blockchainContext);
          if (user.data.assetContext) setAssetContext(user.data.assetContext);
          if (user.data.context) setContext(user.data.context);
          // eslint-disable-next-line no-console
          // console.log("user: ", user);
        }
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
  // Add pairWallet and switchWallet to the context value
  const value: any = useMemo(
      () => ({ state, dispatch, pairWallet, switchWallet }),
      [state]
  );

  return (
      <PioneerContext.Provider value={value}>{children}</PioneerContext.Provider>
  );
};

export const usePioneer = (): any =>
    useContext(PioneerContext as unknown as React.Context<IPioneerContext>);
