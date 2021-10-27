import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import EditView from "./EditView";
import s from './VocabularyPanel.module.css';
import { Word } from '../../Types';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { ThemeContext } from '../../Main';
import { Tooltip } from '../../../helpers/ComponentHelpers';

type WordViewProps = {
    word: Word;
    index: number;
    onSave: (w: Word) => void;
    originals: string[];
    remove: (v: Word) => void;
    isNew: boolean;
    passFocus: () => void;
    order: number;
}

export default function WordView(props: WordViewProps) {
    return (
        <div className={s.item}>
            <ProgressBar progress={props.word} />
            <div className={s.info}>
                <EditView
                    word={props.word}
                    onSave={props.onSave}
                    originals={props.originals}
                    remove={() => props.remove(props.word)}
                    focus={props.isNew && props.index === 0}
                    passFocus={props.passFocus}
                />
            </div>
            <RemoveButton onClick={() => props.remove(props.word)} />
        </div>
    )
}

type ProgressBarProps = {
    progress: Word;
}

function ProgressBar(props: ProgressBarProps) {
    const progressStatus = props.progress.repeated.original + props.progress.repeated.translated + props.progress.repeated.writed;
    const theme = useContext(ThemeContext);
    return (
        <div className={s.progress}>
            {Array.from(Array(maxNumberDefiningNew).keys()).map(el =>
                <div key={el} className={`${s.progress_item} ${progressStatus >= el + 1 ? s.progress_positive : ''}`}>
                </div>
            ).reverse()}
            <Tooltip text={`progress is ${progressStatus}`} theme={theme} />
        </div>
    )
}

function RemoveButton(props: { onClick: () => void }) {
    const theme = useContext(ThemeContext);
    return (
        <div className={s.remove_control + ' ' + s['remove_control_' + theme]} >
            <div className={s.remove_button} onClick={props.onClick}>
                <div>x</div>
                <Tooltip text={'remove'} theme={theme} />
            </div>
        </div>
    )
}
