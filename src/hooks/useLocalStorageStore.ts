import { useEffect, useReducer } from "react";
import { LocalOrder } from "./useLocalTradeStorageState";

type StorageState = LocalOrder[];

type SubscribeFunctionType = () => void;

class LocalTradingStorage {
  private key = "tradingStorage";
  private state: StorageState;
  subscribeFunctions: SubscribeFunctionType[] = [];

  constructor() {
    const valueInLocalStorage = window.localStorage.getItem(this.key);
    if (valueInLocalStorage == null) {
      this.state = [];
      return;
    }
    this.state = JSON.parse(valueInLocalStorage) as StorageState;
  }

  subscribe(subscribeFunction: SubscribeFunctionType) {
    this.subscribeFunctions.push(subscribeFunction);
    return this.subscribeFunctions.length - 1;
  }

  unsubscribe(index: number) {
    this.subscribeFunctions[index] = () => null;
  }

  updateState() {
    this.subscribeFunctions.forEach((fn) => fn());
  }

  get State() {
    return this.state;
  }

  setState(state: StorageState) {
    this.state = state;
    window.localStorage.setItem(this.key, JSON.stringify(this.state));
    this.updateState();
  }
}

const localTradingStorage = new LocalTradingStorage();

export const useLocalStorageStore = (): [
  StorageState,
  (newState: StorageState) => void
] => {
  const [, forceRender] = useReducer((previous) => previous + 1, 0);

  useEffect(() => {
    const index = localTradingStorage.subscribe(forceRender);
    return () => localTradingStorage.unsubscribe(index);
  }, []);

  const state = localTradingStorage.State;

  const setState = (newState: StorageState) => {
    localTradingStorage.setState(newState);
  };

  return [state, setState];
};
