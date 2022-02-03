import { useEffect, useRef, useState } from "react";
import { ConnectionState, EventMessage, GetStatesCommand, GetStatesMessage, HomeAssistant, Message, SubscribeEventsCommand } from "./useHomeAssistant";


export interface EntityCache {
    states: AnyEntity[]
}

export function useEntityCache(ha: HomeAssistant): EntityCache {
    
    const [states, setStates] = useState<AnyEntity[]>([]);    
    const statesRef = useRef<AnyEntity[]>();
    statesRef.current = states;

    const haRef = useRef<HomeAssistant>();
    haRef.current = ha;
   
    useEffect(() => {
        if (ha.connectionState === ConnectionState.AUTHENTICATED) {
            haRef.current.send(new GetStatesCommand(), (msg: Message) => {
                const resp = msg as GetStatesMessage;
                if (resp.success) {
                    setStates(resp.result);

                    haRef.current.send(new SubscribeEventsCommand('state_changed'), (msg: Message) => {
                        const emsg = msg as EventMessage;
                        if (emsg && emsg.type === 'event' && emsg.event.data.new_state) {
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