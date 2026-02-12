import React, { type ReactNode } from "react";
import { StateManager } from "../Managers/StateManager/StateManager";

export const MainContext = React.createContext<StateManager>(
  new StateManager(),
);

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const [stateManager] = React.useState(() => new StateManager());
  return (
    <MainContext.Provider value={stateManager}>
      {" "}
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => React.useContext(MainContext);
