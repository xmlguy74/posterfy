import React from 'react';

export interface PlatformProps {
    className?: string
    platform?: string
}

export function Platform(props: PlatformProps) {
    var platformImage = `url('platform_${props.platform}.png')`;

    return (
        <div className={props.className} style={{backgroundImage: platformImage}}></div>
    );
}