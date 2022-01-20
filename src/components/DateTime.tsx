import moment from 'moment';
import React, { useEffect, useState } from 'react';

export enum DateTimeMode {
    Time,
    Date,
}

export interface DateTimeProps {
    mode: DateTimeMode
    className?: string
}

export function DateTime(props: DateTimeProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);

        return () => clearInterval(timer);
    });

    return (
        <div className={props.className}>
            {props.mode === DateTimeMode.Time ?
                (moment(now).format("h:mm A")) :
                (
                    <>
                        <div style={{fontSize: 'smaller'}}>{moment(now).format("MMMM")}</div>
                        <div style={{fontSize: 'larger'}}>{moment(now).format("D")}</div>
                        <div style={{fontSize: 'smaller'}}>{moment(now).format("YYYY")}</div>
                    </>
                )
            }
        </div>
    );
}