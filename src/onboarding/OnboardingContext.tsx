/**
 * In-memory onboarding state — temporary data collected during the sign-up flow.
 * NOT persisted; saved to UserContext + AsyncStorage only at OnboardingComplete.
 */
import React, { createContext, useState, ReactNode } from 'react';

export type OnboardingData = {
  language?: string;
  businessInfo?: Record<string, any>;
  profileInfo?: Record<string, any>;
  location?: string;
  purpose?: string;
  interests?: string[];
};

type OnboardingContextType = {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
};

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({});
  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingContext.Provider>
  );
};
