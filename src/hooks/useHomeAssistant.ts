import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export enum ConnectionState {
    UNINSTANTIATED,
    CONNECTING,
    CONNECTED,
    AUTHENTICATED,
    BROKEN,
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

export class PingCommand extends Command {
    constructor() {
        super('ping')
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

export interface GetStatesMessage extends ResultMessage<AnyEntity[]> {

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
    new_state: AnyEntity,
    old_state: AnyEntity,
}

export interface HomeAssistant {
    connectionState: ConnectionState,
    send: <TCommand extends Command>(command: TCommand, callback?: SendCallback) => void,
    api: (method: string, path: string) => Promise<any>,
}

export type SendCallback = (msg: Message) => boolean | void;

export function useHomeAssistant(hostname: string, authToken: string): HomeAssistant {
    
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [connect, setConnect] = useState<boolean>(true);
    const [callbacks] = useState<Map<number, SendCallback>>(new Map<number, SendCallback>());

    const callbacksRef = useRef<Map<number, SendCallback>>();
    callbacksRef.current = callbacks;

    const { sendMessage, lastMessage, readyState } = useWebSocket('ws://' + hostname + "/api/websocket", {
        retryOnError: false,
        reconnectAttempts: 2592000000,
        reconnectInterval: 5000,
        shouldReconnect: (e) => true,
    }, connect);

    const connectionState = useMemo<ConnectionState>(() => {
        switch (readyState) {
            case ReadyState.CONNECTING: {
                return ConnectionState.CONNECTING;
            }
            case ReadyState.OPEN: {
                if (!connect) return ConnectionState.BROKEN;                
                return !authorized ? 
                    ConnectionState.CONNECTED :
                    ConnectionState.AUTHENTICATED;
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
    }, [readyState, authorized, connect]);

    const connectionStateRef = useRef<ConnectionState>();
    connectionStateRef.current = connectionState;

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
                    const c = callbacksRef.current.get(m.id);
                    if (c) {
                        if (!c(m)) {
                            callbacksRef.current.delete(m.id);
                        }
                    }
                    break;
            }
        }
    
        if (lastMessage) {
            processMessage(lastMessage);
        }
    }, [authToken, sendMessage, lastMessage]);
    
    const send = useCallback(<TCommand extends Command>(command: TCommand, callback?: SendCallback) => {
        if (callback && command.id) {            
            callbacksRef.current.set(command.id, callback);
        }
        sendMessage(JSON.stringify(command), false);
    }, [sendMessage]);
        
    const doPing = useCallback(() => {
        try {
            if (connectionStateRef.current === ConnectionState.AUTHENTICATED || connectionStateRef.current === ConnectionState.BROKEN) {
                const handle = setTimeout(() => {
                    callbacksRef.current.clear();
                    setConnect(false);
                }, 5000);

                send(new PingCommand(), (msg: Message) => {
                    clearTimeout(handle);
                    setConnect(true);
                    return false;
                })
            }
            else {
                setConnect(true);
            }
        } catch (e) {
            console.error(e);
        }
    }, [send]);

    useEffect(() => {
        const handle = setInterval(doPing, 10000);
        return () => clearInterval(handle);
    }, [doPing])

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
    }
}