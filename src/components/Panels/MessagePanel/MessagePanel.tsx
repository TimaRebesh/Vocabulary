import React from 'react';
import s from './MessagePanel.module.css';

type MessagePanelProps = {
    messages: (string | JSX.Element)[];
    legend?: string;
    children?: JSX.Element;
}

export default function MessagePanel({ messages, legend, children }: MessagePanelProps) {
    return (
        <div className={s.block_message}>
            {legend && <h2>{legend}</h2>}
            {messages.map((message, ind) => <div key={ind}>{message}</div>)}
            {children}
        </div>
    )
}
