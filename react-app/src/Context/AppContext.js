import React, { createContext } from 'react';
import { Observable } from 'windowed-observable';

const AppContext = createContext();
const observable = new Observable('AppObservable');

const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={observable}>{children}</AppContext.Provider>
  );
};

export { AppProvider, AppContext };
