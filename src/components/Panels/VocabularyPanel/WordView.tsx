import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import EditView from "./EditView";
import remove from '../../../assets/images/close-icon.png';
import s from './VocabularyPanel.module.css';
import { Word } from '../../Types';
import { maxNumberDefiningNew } from '../../../utils/determinant';

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

    const progressStatus = props.word.repeated.original + props.word.repeated.translated + props.word.repeated.writed;

    return (
        <div className={s.item}>
            
            <div className={s.progress}>
                {Array.from(Array(maxNumberDefiningNew).keys()).map(el =>
                    <div key={el} className={`${s.progress_item} ${progressStatus >= el + 1 ? s.progress_positive : ''}`}></div>
                ).reverse()}
            </div>
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
            <img src={remove} alt='remove' className={s.remove_control} onClick={() => props.remove(props.word)} />
        </div>
    )
}

type ProgressBarProps = {

}

function ProgressBar(props: ProgressBarProps) {
    return <div className={s.progress}>
        <div className={s.bar}></div>
    </div>
}
