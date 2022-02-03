import * as React from "react";
import { useEntityCache } from "../hooks/useEntityCache";
import { HomeAssistant, useHomeAssistant } from "../hooks/useHomeAssistant";

interface HomeAssistantContextType {
    ha: HomeAssistant,
    states: AnyEntity[],
}

export const HomeAssistantContext = React.createContext<HomeAssistantContextType>(
  {
    ha: null,
      states: [],
  }
)

export interface HomeAssistantProviderProps {
    hostname: string,
    authToken: string
}

export function HomeAssistantProvider(props: React.PropsWithChildren<HomeAssistantProviderProps>) {
    
    const ha = useHomeAssistant(props.hostname, props.authToken);
    const { states } = useEntityCache(ha);
    
    return (
        <HomeAssistantContext.Provider value={{ha, states}}>
            {props.children}
        </HomeAssistantContext.Provider>
    );
}