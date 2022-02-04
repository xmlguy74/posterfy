import { useEffect, useRef, useState } from "react";
import { EventMessage, GetStatesCommand, GetStatesMessage, HomeAssistant, Message, SubscribeEventsCommand } from "./useHomeAssistant";


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
        if (ha.ready) {
            haRef.current.send(new GetStatesCommand(), (msg: Message) => {
                const resp = msg as GetStatesMessage;
                if (resp.success) {
                    console.log('Initialized entity state cache.');
                    setStates(resp.result);

                    haRef.current.send(new SubscribeEventsCommand('state_changed'), (msg: Message) => {
                        const emsg = msg as EventMessage;
                        if (emsg && emsg.type === 'event' && emsg.event.data.new_state) {
                            console.log(`State changed: ${emsg.event.data.new_state.entity_id}, Value: '${emsg.event.data.new_state.state}'`)
                            setStates([...statesRef.current.filter(i => i.entity_id !== emsg.event.data.entity_id), emsg.event.data.new_state]);
                        }
                        return true;                    
                    });
                }
            });
        }        
    }, [ha.ready])

    return {
        states
    }

}