"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BismillahContextType {
  showBismillah: boolean;
  toggleBismillah: () => void;
}

const BismillahContext = createContext<BismillahContextType | undefined>(
  undefined
);

export function BismillahProvider({ children }: { children: React.ReactNode }) {
  const [showBismillah, setShowBismillah] = useState(false);

  useEffect(() => {
    // Load the state from localStorage on mount
    const savedState = localStorage.getItem("showBismillah");
    if (savedState !== null) {
      setShowBismillah(JSON.parse(savedState));
    }
  }, []);

  const toggleBismillah = () => {
    setShowBismillah((prev) => {
      const newState = !prev;
      localStorage.setItem("showBismillah", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <BismillahContext.Provider value={{ showBismillah, toggleBismillah }}>
      {children}
    </BismillahContext.Provider>
  );
}

export function useBismillah() {
  const context = useContext(BismillahContext);
  if (context === undefined) {
    throw new Error("useBismillah must be used within a BismillahProvider");
  }
  return context;
}
