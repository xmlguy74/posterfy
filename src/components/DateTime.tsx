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
        const timer = setInterval(() => setNow(new Date()), 250);

        return () => clearInterval(timer);
    });

    var mom = moment(now);

    return (
        <div className={props.className}>
            {props.mode === DateTimeMode.Time ?
                (
                    <>
                        <span>{mom.format("h")}</span>
                        <span style={{visibility: (now.getSeconds() % 2) == 0 ? "visible" : "hidden"}}>:</span>
                        <span>{mom.format("m")}</span>
                        <span> {mom.format("A")}</span>
                    </>
                ) :
                (
                    <>
                        <div>{moment(now).format("MMMM d, YYYY")}</div>
                    </>
                )
            }
        </div>
    );
}