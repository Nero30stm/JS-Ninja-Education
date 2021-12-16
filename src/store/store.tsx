import { createContext, useContext } from "react";
import { PillsStore, daysObj} from "./PillStore";
import { configure } from 'mobx';

export const pillsStore = new PillsStore();
export const storesContext = createContext({ pillsStore});
export const useStores = () => useContext(storesContext);

export const daysStore = new daysObj();
export const daysContext = createContext({daysStore});
export const useDaysStores = () => useContext(daysContext);

configure({ enforceActions: 'always' });
