import { useEffect, useRef, useState } from 'react';
import { PosterContainer, PosterImage } from './Poster.styled';

export interface PosterProps {
    className?: string,
    imageUrl: string
}

export function Poster(props: PosterProps) {
    
    const [images, setImages] = useState<string[]>([]);
    const [animate, setAnimate] = useState<boolean>(false);

    const currentContent = useRef<HTMLDivElement>();

    useEffect(() => {
        setImages(arr => [images.at(1), props.imageUrl]);
        // setAnimate(true);
        // const timeout = setTimeout(() => setAnimate(false), 3000);
        // return () => clearTimeout(timeout);
    }, [props])

    return (
        <PosterContainer className={props.className}>
            <PosterImage style={{backgroundImage: `url(${images.at(0)})`}} />
            <PosterImage ref={currentContent} animate={animate} style={{backgroundImage: `url(${images.at(1)})`}} />
        </PosterContainer>
    );
}