import React from 'react';

export interface TimeProps {
    className?: string
}

export function Time(props: TimeProps) {
    return (
        <div className={props.className}>
            12:30 PM
        </div>
    );
}