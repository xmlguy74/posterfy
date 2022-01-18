import React from 'react';

export interface DateProps {
    className?: string
}

export function Date(props: DateProps) {
    return (
        <div className={props.className}>
            <div>January</div>
            <div style={{fontSize:'larger'}}>18</div>
            <div>2022</div>            
        </div>
    );
}