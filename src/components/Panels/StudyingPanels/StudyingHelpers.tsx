import React, { useContext } from 'react';
import { getWordProgress } from '../../../helpers/fucntionsHelp';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { ThemeContext } from '../../Main';
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
    const theme = useContext(ThemeContext);
    return <>
        <div className={`${s.word} ${s['word_' + theme]}`}>
            <div>{props.mode === 'original' ? props.studyWord.original : props.studyWord.translated}</div>
        </div>
        <div className={`${s.other_block} ${s['other_block_' + theme]}`}>
            {props.studyWord.anothers.length > 0 && <div className={s.other}>no:
                {props.studyWord.anothers.map((a, ind, ar) => <span key={a + ind}>{a}{ind !== ar.length - 1 ? ',' : ''}</span>)}
            </div>}
        </div>
    </>
}

export function FinishedView(props: { onClick: () => void }) {
    const theme = useContext(ThemeContext);
    return <div className={s['finished_' + theme]}>
        <p>Practice is finished</p>
        <button className='button' onClick={props.onClick}>Try again</button>
    </div>
}
