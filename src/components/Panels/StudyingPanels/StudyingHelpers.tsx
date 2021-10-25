import React from 'react';
import { getWordProgress } from '../../../helpers/fucntionsHelp';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { Word } from '../../Types';
import s from './StudyingPanel.module.css';

export const forPracticeMinWords = 4;

export function checkIsWordNew(word: Word) {
    return getWordProgress(word) < maxNumberDefiningNew;
}

export function setCheer(currentWord: Word) {
    const progress = getWordProgress(currentWord) + 1;
    progress === maxNumberDefiningNew ? window.eventBus.notify('stydied') : window.eventBus.notify('cheer');
}

export function StudyingWord(props: { mode: string, studyWord: Word }) {
    return <>
        <div className={s.word}>
            <p>{props.mode === 'original' ? props.studyWord.original : props.studyWord.translated}</p>
        </div>
        <div className={s.other_block}>
            {props.studyWord.anothers.length > 0 && <div className={s.other}>no:
                {props.studyWord.anothers.map((a, ind, ar) => <span key={a + ind}>{a}{ind !== ar.length - 1 ? ',' : ''}</span>)}
            </div>}
        </div>
    </>
}
