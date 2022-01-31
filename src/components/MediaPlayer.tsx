import React, { useContext } from 'react';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';
import { Container, ContentSection, MediaImage, StatusSection } from './MediaPlayer.styled';
import * as Bootstrap from 'react-icons/bs';
import { resolveMetadata } from '../utilHelpers';

export interface MediaPlayerProps {
    className?: string,
    style?: React.CSSProperties,
    config: MediaPlayerConfig,
}

interface MediaPlayerSource {
    text: string,
    image: string,
}

interface MediaPlayerState {
    text: string,
    icon: string,
}

export function MediaPlayer(props: MediaPlayerProps) {

    const ha = useContext(HomeAssistantContext);

    const mp = ha.states?.find(i => i.entity_id === props.config.entity_id);

    const source = resolveMetadata<MediaPlayerSource>(props.config.entity_id, mp, ha, props.config.source);
    const state = resolveMetadata<MediaPlayerState>(props.config.entity_id, mp, ha, props.config.state);
    
    const stateIcon = (Bootstrap as any)[state.icon] ?? Bootstrap.BsQuestionCircle;

    return (
        <Container className={props.className} style={props.style}>
            <ContentSection className='MediaPlayer-Content'>
                { source.image && <MediaImage style={{backgroundImage: `url(http://${window.CONFIG.homeAssistant}${source.image}`}} /> }
                <div>{source.text}</div>
            </ContentSection>
            <StatusSection className='MediaPlayer-Status'>
                { React.createElement(stateIcon) }
                &nbsp;
                <div>{state.text}</div>
            </StatusSection>
        </Container>
    )
}