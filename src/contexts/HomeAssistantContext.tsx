import * as React from "react";
import { useEntityStateCache } from "../hooks/useEntityStateCache";
import { EntityState, HomeAssistant, useHomeAssistant } from "../hooks/useHomeAssistant";

interface HomeAssistantContextType {
    ha: HomeAssistant,
    states: EntityState[]
}

export const HomeAssistantContext = React.createContext<HomeAssistantContextType>(
  {
      ha: null,
      states: null,
  }
)

export interface HomeAssistantProviderProps {
    hostname: string,
    authToken: string
}

export function HomeAssistantProvider(props: React.PropsWithChildren<HomeAssistantProviderProps>) {
    
    const ha = useHomeAssistant(props.hostname, props.authToken);
    const { states } = useEntityStateCache(ha);
    
    return (
        <HomeAssistantContext.Provider value={{ha, states}}>
            {props.children}
        </HomeAssistantContext.Provider>
    );
}