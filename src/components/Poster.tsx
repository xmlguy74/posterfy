import { useEffect, useRef, useState } from 'react';
import { PosterContainer, PosterImage } from './Poster.styled';

export interface PosterProps {
    className?: string,
    imageUrl: string,
    style?: React.CSSProperties
}

export function Poster(props: PosterProps) {
    
    const [images, setImages] = useState<string[]>([]);

    const imagesRef = useRef<string[]>();

    imagesRef.current = images;

    const currentContent = useRef<HTMLDivElement>();

    useEffect(() => {
        setImages(arr => [imagesRef.current.at(1), props.imageUrl]);
    }, [props.imageUrl])

    return (
        <PosterContainer className={props.className} style={props.style}>
            <PosterImage style={{backgroundImage: `url(${images.at(0)})`}} />
            <PosterImage ref={currentContent} style={{backgroundImage: `url(${images.at(1)})`}} />
        </PosterContainer>
    );
}