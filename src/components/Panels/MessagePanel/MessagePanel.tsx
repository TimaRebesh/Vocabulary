import React from 'react';
import s from './MessagePanel.module.css';

type MessagePanelProps = {
    firstMes?: string;
    secondMes?: string;
}

export default function MessagePanel({ firstMes, secondMes }: MessagePanelProps) {

    return (
        <div className={s.more_words}>
            <p>You should have more than 3 NEW words</p>
            {firstMes
                ? <span>{firstMes}</span>
                : <span>Please add new words in <h3>"My Vocabulary"</h3></span>
            }
        </div>
    )
}
