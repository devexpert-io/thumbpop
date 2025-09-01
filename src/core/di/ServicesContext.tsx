import React, { createContext, useContext, ReactNode } from 'react';
import { DIContainer, diContainer } from './DIContainer';

const ServicesContext = createContext<DIContainer | null>(null);

interface DIProviderProps {
    children: ReactNode;
}

export const DIProvider: React.FC<DIProviderProps> = ({ children }) => {
    return <ServicesContext.Provider value={diContainer}>{children}</ServicesContext.Provider>;
};

export const useServices = (): DIContainer => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a DIProvider');
    }
    return context;
};