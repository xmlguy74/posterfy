import React, { useContext } from 'react';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';
import { Container, MediaImage } from './MediaPlayer.styled';

export interface MediaPlayerProps {
    className?: string,
    style?: React.CSSProperties,
    entity: string,
}

export function MediaPlayer(props: MediaPlayerProps) {

    const { states } = useContext(HomeAssistantContext);

    const mp = states?.find(i => i.entity_id == window.CONFIG.mediaPlayer);

    return (
        <>
        { mp && 
            <Container className={props.className} style={props.style}>
                <MediaImage style={{backgroundImage: `url(http://${window.CONFIG.homeAssistant}${mp.attributes.entity_picture}`}} />
                <div>{mp.state}</div>
            </Container>
        }
        </>
    )
}