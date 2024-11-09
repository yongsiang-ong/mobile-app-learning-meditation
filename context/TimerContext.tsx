import { createContext, ReactNode, useState } from "react";

interface TimerContextType {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const DEFAULT_TIMER = 10;

export const TimerContext = createContext<TimerContextType>({
  duration: DEFAULT_TIMER,
  setDuration: () => {},
});

const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [duration, setDuration] = useState(DEFAULT_TIMER);
  return (
    <TimerContext.Provider value={{ duration, setDuration }}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
