import { useGetConfigQuery } from '../../../API/configApi';
import { getWordProgress, shuffle } from '../../../helpers/fucntionsHelp';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { Configurations, Repeated, Word } from '../../Types';
import s from './StudyingPanel.module.css';

export const forPracticeMinWords = 4;

export const checkIsWordNew = (word: Word) => getWordProgress(word) < maxNumberDefiningNew;

export const defineMode = (word: Word, modeWrite: boolean) => {
    let mode: Repeated | string;
    const { original, translated, writed } = word.repeated;
    mode = original >= translated ? 'translated' : 'original';
    if (modeWrite) {
        if (mode === 'translated' && translated > writed)
            mode = 'writed';
    }
    return mode;
}

export const defineOptionalSet = (position: number, vocabulary: Word[], dataSet: Word[]) => {
    let words: Word[] = [];
    const withoutStudyWordOrderSet = vocabulary.filter((i) => i.id !== dataSet[position].id);   // removed word by studyOrder
    const shuffled = shuffle(withoutStudyWordOrderSet);                                         // mixing
    words = shuffled.slice(0, 3);                                                               // cut
    words.push(dataSet[position]);                                                              // added word by studyOrder like first element
    return shuffle(words);
}

export const setCheer = (currentWord: Word) => {
    const progress = getWordProgress(currentWord) + 1;
    return progress === maxNumberDefiningNew ? 'stydied' : 'cheer';
}

export const hideCongrats = () => 'nextWord';

export function StudyingWord(props: { mode: string, studyWord: Word }) {

    const config = useGetConfigQuery().data as Configurations;
    const theme = config.theme;

    return <>
        <div className={`${s.word} ${s['word_' + theme]}`}>
            <div>{props.mode === 'original' ? props.studyWord.original : props.studyWord.translated}</div>
        </div>
        <div className={`${s.other_block} ${s['other_block_' + theme]}`}>
            {props.studyWord.anothers.length > 0 && config.hints &&
                <div className={s.other}>hint:
                    {props.studyWord.anothers.map((a, ind, ar) => <span key={a + ind}>{a}{ind !== ar.length - 1 ? ',' : ''}</span>)}
                </div>}
        </div>
    </>
}
