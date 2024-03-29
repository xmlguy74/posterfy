import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";


export const PosterContainer = styled.div`
    position: relative;
`
const FadeIn = keyframes`
    0% {
        opacity:0;
    }
    100% {
        opacity:1;
    }
`

export interface PosterImageProps {
    animate?: boolean
}

export const PosterImage = styled('div')<PosterImageProps>({
    position: 'absolute',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100%',
    width: '100%',
    zIndex: '-1'
}, props => ({
    animation: props.animate ? `${FadeIn} ease 2s` : 'none'
}));