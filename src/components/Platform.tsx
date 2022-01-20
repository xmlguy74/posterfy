import React from 'react';

export interface PlatformProps {
    className?: string
}

export function Platform(props: PlatformProps) {
    return (
        <div className={props.className}></div>
    );
}