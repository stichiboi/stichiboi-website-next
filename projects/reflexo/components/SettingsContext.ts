import { createContext } from "react";

export const SettingsContext = createContext({
  numberOfTries: 3,
  setNumberOfTries: (_: number) => {
  }
});