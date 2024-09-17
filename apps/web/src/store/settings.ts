import {createStore} from 'zustand';

import {ROD_RELAYS} from '../utils/relay';
import createBoundedUseStore from './createBoundedUseStore';

type State = {
  relays: string[];
};

type Action = {
  setRelays: (relays: string[]) => void;
};

const getDefaultValue = () => {
  return {
    relays: ROD_RELAYS,
  };
};
export const settingsStore = createStore<State & Action>((set, get) => ({
  // relays: undefined as unknown as string[],
  relays: getDefaultValue().relays,
  setRelays: (relays) => {
    set({relays});
  },
}));

export const useSettingsStore = createBoundedUseStore(settingsStore);
