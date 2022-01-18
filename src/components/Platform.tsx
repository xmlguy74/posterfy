import React from 'react';

export interface PlatformProps {
    className?: string
}

export function Platform(props: PlatformProps) {
    return (
        <img className={props.className} src="platform.png" alt="Platform" />
    );
}