import {createStore} from 'zustand';

import { Proof } from '@cashu/cashu-ts';
import createBoundedUseStore from './createBoundedUseStore';

interface State  {
  publicKey: string;
  privateKey: string;
  isExtension?: boolean;
  nwcUrl?: string;

  // Cashu store auth
  isSeedCashuStorage?: boolean;
  seed?: Uint8Array;
  mnemonic?: string;
  mints?: string[];
  mintRequests?: string[];
  proofs?: Proof[];
  useNostr?: boolean;
  pendingTokens?:string[];
};

interface Action {
  setAuth: (publicKey: string, privateKey: string) => void;
  setPublicKey: (publicKey: string) => void;
  setIsExtensionConnect: (isExtension: boolean) => void;

  // Cashu Wallet
  setIsSeedCashuStorage:(isSeedStorage:boolean) => void;
  setMnemonic: (mnemonic:string) => void;
  setSeed: (seed:Uint8Array) => void;

  setMints: (mints:string[]) => void;
  setProofs: (proofs:Proof[]) => void;
  setMintsRequests: (mintRequests:string[]) => void;
  setNWCUrl: (nwcUrl:string) => void;
};

export const cashuStore = createStore<State & Action>((set) => ({
  // publicKey and privateKey are set to undefined but we know they are strings
  // so we can cast them as strings without hassle in the app
  publicKey: undefined as unknown as string,
  privateKey: undefined as unknown as string,
  nwcUrl: undefined as unknown as string,
  seed: undefined as unknown as Uint8Array,
  mnemonic: undefined as unknown as string,
  mints: undefined as unknown as string[],
  mintRequests: undefined as unknown as string[],
  proofs: undefined as unknown as Proof[],

  setAuth: (publicKey, privateKey) => {
    set({publicKey, privateKey});
  },
  setNWCUrl: (nwcUrl) => {
    set({nwcUrl});
  },
  setPublicKey: (publicKey) => {
    set({publicKey});
  },
  setIsExtensionConnect: (isExtension) => {
    set({isExtension});
  },

  // Cashu store
 
  setIsSeedCashuStorage: (isSeedCashuStorage) => {
    set({isSeedCashuStorage});
  },
  setSeed: (seed) => {
    set({seed});
  },
  setMnemonic: (mnemonic) => {
    set({mnemonic});
  },
  setMints: (mints) => {
    set({mints});
  },
  setMintsRequests: (mintRequests) => {
    set({mintRequests});
  },
  setProofs: (proofs) => {
    set({proofs});
  },
}));

export const useCashuStore= createBoundedUseStore(cashuStore);
