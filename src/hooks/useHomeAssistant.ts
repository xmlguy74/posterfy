import { useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export enum ConnectionState {
    UNINSTANTIATED,
    CONNECTING,
    CONNECTED,
    AUTHENTICATING,
    AUTHENTICATED,
    CLOSING,
    CLOSED,
}

var commandId = 1;

export class Command {
    public id: number;

    constructor(
        public type: string
    ) {
        this.id = commandId++;
    }
}

export class SubscribeEventsCommand extends Command {
    constructor(public event_type: 'state_changed') {
        super('subscribe_events');
    }
}

export class GetStatesCommand extends Command {
    constructor() {
        super('get_states')
    }
}

export interface Message {    
    id: number,
    type: string,
}

export interface ResultMessage<T> extends Message {
    success: boolean,
    result: T
}

export interface GetStatesMessage extends ResultMessage<EntityState[]> {

}

export interface EventMessage extends Message {
    type: "event",
    event: EventMessageEvent,
}

export interface EventMessageEvent {
    data: EventMessageData,
}

export interface EventMessageData {
    entity_id: string,
    new_state: EntityState,
    old_state: EntityState,
}

export interface EntityState {
    entity_id: string,
    state: string,
    attributes: any,
}

export interface HomeAssistant {
    connectionState: ConnectionState,
    send: <TCommand extends Command>(command: TCommand, callback?: SendCallback) => void,
    api: (method: string, path: string) => Promise<any>,
    received: Message,
}

export type SendCallback = (msg: Message) => boolean | void;

const callbacks = new Map<number, SendCallback>();

export function useHomeAssistant(hostname: string, authToken: string): HomeAssistant {

    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://' + hostname + "/api/websocket");
    const [received] = useState<Message>();
    const [authorized, setAuthorized] = useState<boolean>(null);

    const connectionState = useMemo<ConnectionState>(() => {
        switch (readyState) {
            case ReadyState.CONNECTING: {
                return ConnectionState.CONNECTING;
            }
            case ReadyState.OPEN: {
                return authorized === null ? 
                    ConnectionState.CONNECTED :
                    authorized ? ConnectionState.AUTHENTICATED : ConnectionState.AUTHENTICATING;
            }
            case ReadyState.CLOSING: {
                return ConnectionState.CLOSING;
            }
            case ReadyState.CLOSED: {
                return ConnectionState.CLOSED;
            }
            default: {
                return ConnectionState.UNINSTANTIATED;
            }
        }        
    }, [readyState, authorized]);

    useEffect(() => {

        function processMessage(msg: MessageEvent<any>) {
            const data = JSON.parse(msg.data);        
            switch (data?.type) {
                case 'auth_required':
                    setAuthorized(false);
                    sendMessage(JSON.stringify({
                        type: 'auth',
                        access_token: authToken
                    }));
                    break;
                
                case 'auth_ok':
                    setAuthorized(true);
                    break;
    
                default:
                    const m = data as Message;
                    const c = callbacks.get(m.id);
                    if (c) {
                        if (!c(m)) {
                            callbacks.delete(m.id);
                        }
                    }
                    break;
            }
        }
    
        if (lastMessage) {
            processMessage(lastMessage);
        }
    }, [authToken, sendMessage, lastMessage]);

    function send<TCommand extends Command, TMessage extends Message>(command: TCommand, callback?: SendCallback) {
        if (callback && command.id) {            
            callbacks.set(command.id, callback);
        }
        sendMessage(JSON.stringify(command));
    }

    async function api(method: string, path: string) {
        if (path.startsWith('/')) {
            path = path.substring(1);
        }
        
        const res = await fetch('http://' + hostname + '/api/' + path, {
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        });
    
        return (await res.json());
    }

    return {
        connectionState,
        send,
        api,
        received,
    }
}