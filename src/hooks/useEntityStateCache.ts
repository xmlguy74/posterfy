import { useCallback, useEffect, useRef, useState } from "react";
import { ConnectionState, EntityState, EventMessage, GetStatesCommand, GetStatesMessage, HomeAssistant, Message, SubscribeEventsCommand } from "./useHomeAssistant";


export function useEntityStateCache(ha: HomeAssistant) {
    
    const [states, setStates] = useState<EntityState[]>(null);
    const statesRef = useRef<EntityState[]>();

    statesRef.current = states;
   
    useEffect(() => {
        if (ha.connectionState === ConnectionState.AUTHENTICATED) {
            ha.send(new GetStatesCommand(), (msg: Message) => {
                const resp = msg as GetStatesMessage;
                if (resp.success) {
                    setStates(resp.result);

                    ha.send(new SubscribeEventsCommand('state_changed'), (msg: Message) => {
                        const emsg = msg as EventMessage;
                        if (emsg && emsg.type === 'event') {                            
                            setStates([...statesRef.current.filter(i => i.entity_id !== emsg.event.data.entity_id), emsg.event.data.new_state]);
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