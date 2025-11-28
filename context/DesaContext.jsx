"use client";

import { createContext, useContext } from "react";

export const DesaContext = createContext();

export const useDesa = () => {
  return useContext(DesaContext);
};

export default function DesaProvider({ children, value }) {
  return <DesaContext.Provider value={value}>{children}</DesaContext.Provider>;
}
