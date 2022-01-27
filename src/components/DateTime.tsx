import moment from 'moment';
import React, { useEffect, useState } from 'react';

export enum DateTimeMode {
    Time,
    Date,
}

export interface DateTimeProps {
    mode: DateTimeMode
    className?: string
    style?: React.CSSProperties
}

export function DateTime(props: DateTimeProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 500);

        return () => clearInterval(timer);
    });

    var mom = moment(now);

    return (
        <div className={props.className} style={props.style}>
            {props.mode === DateTimeMode.Time ?
                (
                    <>
                        <span>{mom.format("h")}</span>
                        <span style={{visibility: (now.getSeconds() % 2) === 0 ? "inherit" : "hidden"}}>:</span>
                        <span>{mom.format("mm")}</span>
                        <span> {mom.format("A")}</span>
                    </>
                ) :
                (
                    <>
                        <div>{moment(now).format("MMM DD, YYYY")}</div>
                    </>
                )
            }
        </div>
    );
}