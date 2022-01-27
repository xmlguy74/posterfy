import { useCallback, useEffect, useRef, useState } from "react";
import { ConnectionState, EntityState, EventMessage, GetStatesCommand, GetStatesMessage, HomeAssistant, Message, SubscribeEventsCommand } from "./useHomeAssistant";


type EntityStateCache = Map<string, EntityState>

export function useEntityStateCache(ha: HomeAssistant) {
    
    const [states, setStates] = useState<EntityStateCache>(null);
    const statesRef = useRef<EntityStateCache>();

    statesRef.current = states;
   
    useEffect(() => {
        if (ha.connectionState === ConnectionState.AUTHENTICATED) {
            ha.send(new GetStatesCommand(), (msg: Message) => {
                const resp = msg as GetStatesMessage;
                if (resp.success) {
                    setStates(new Map(resp.result.map(r => [r.entity_id, r])));

                    ha.send(new SubscribeEventsCommand('state_changed'), (msg: Message) => {
                        const emsg = msg as EventMessage;
                        if (emsg && emsg.type === 'event') {
                            setStates(statesRef.current.set(emsg.event.data.entity_id, emsg.event.data.new_state));
                            console.log(emsg);
                        }
                        return true;                    
                    });
                }
            });
        }        
    }, [ha.connectionState])

    return {
        states
    }

}