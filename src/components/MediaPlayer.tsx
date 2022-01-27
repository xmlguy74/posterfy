import React, { useContext } from 'react';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';
import { Container, ContentSection, MediaImage, StatusSection } from './MediaPlayer.styled';
import * as Icons from 'react-icons/fa';

export interface MediaPlayerProps {
    className?: string,
    style?: React.CSSProperties,
    entity: string,
}

const MEDIA_STATES: any = {
    idle: "Off",
    home: "On",
    on: "On",
    playing: "Playing",
    paused: "Paused"
}

const MEDIA_STATE_ICONS: any = {
    idle: 'FaPowerOff',
    home: "FaHome",
    on: "FaStop",
    playing: "FaPlay",
    paused: "FaPause"
}

export function MediaPlayer(props: MediaPlayerProps) {

    const { states } = useContext(HomeAssistantContext);

    const mp = states?.find(i => i.entity_id == window.CONFIG.mediaPlayer);

    return (
        <>
        { mp && 
            <Container className={props.className} style={props.style}>
                <ContentSection className='MediaPlayer-Content'>
                    { mp.attributes.entity_picture && <MediaImage style={{backgroundImage: `url(http://${window.CONFIG.homeAssistant}${mp.attributes.entity_picture}`}} />}
                    <div>{mp.attributes.source}</div>
                </ContentSection>
                <StatusSection className='MediaPlayer-Status'>
                    { React.createElement((Icons as any)[MEDIA_STATE_ICONS[mp.state] ?? 'FaCircleQuestion']) }
                    &nbsp;
                    <div>{MEDIA_STATES[mp.state] ?? mp.state}</div>
                </StatusSection>
            </Container>
        }
        </>
    )
}