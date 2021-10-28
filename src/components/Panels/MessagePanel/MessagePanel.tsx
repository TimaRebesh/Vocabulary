import React from 'react';
import s from './MessagePanel.module.css';

type MessagePanelProps = {
    legend?: string;
    messages: (string | JSX.Element)[];
}

export default function MessagePanel({ messages, legend }: MessagePanelProps) {
    return (
        <div className={s.block_message}>
            {legend && <h2>{legend}</h2>}
            {messages.map(message => <div>{message}</div>)}
        </div>
    )
}
