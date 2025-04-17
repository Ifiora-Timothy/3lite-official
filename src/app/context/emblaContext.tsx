"use client";

import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

export const EmblaContext = createContext({
  setPrevBtnFxn: (prevBtnFxn: { fxn: () => void }) => {},
  setNextBtnFxn: (nextBtnFxn: { fxn: () => void }) => {},
  setCurrSlide(currStartId: number) {},
  clickPrev() {},
  clickNext() {},
  currSlide: 0,
  key: "",
});

export const EmblaContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [prevBtnFxn, setPrevBtnFxn] = useState({
    fxn: () => {
      console.log("prevFxnInit");
    },
  });
  const [nextBtnFxn, setNextBtnFxn] = useState({
    fxn: () => {
      console.log("nextFxnInit");
    },
  });
  const [currSlide, setCurrSlide] = useState(0);
  console.log({ prevBtnFxn, nextBtnFxn });

  const clickPrev = () => {
    prevBtnFxn.fxn();
  };
  const clickNext = () => {
    nextBtnFxn.fxn();
  };
  const key = nextBtnFxn.fxn.toString() + prevBtnFxn.fxn.toString();

  return (
    <EmblaContext.Provider
      value={{
        setCurrSlide,
        currSlide,
        clickNext,
        clickPrev,
        setNextBtnFxn,
        setPrevBtnFxn,
        key,
      }}
    >
      {children}
    </EmblaContext.Provider>
  );
};
