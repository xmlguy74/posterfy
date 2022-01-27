import React, { useContext } from 'react';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';

export interface MediaPlayerProps {
    className?: string,
    style?: React.CSSProperties,
    entity: string,
}

export function MediaPlayer(props: MediaPlayerProps) {

    const { states } = useContext(HomeAssistantContext);

    return (
        <div className={props.className} style={props.style}>
            {states?.get(window.CONFIG.mediaPlayer).state}
        </div>
    )
}