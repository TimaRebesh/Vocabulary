import React, { useEffect, useRef, useState } from 'react';
import { Configurations, PanelName, Repeated, Word } from '../../Types';
import ChoosePanel from './ChoosePanel/ChoosePanel';
import s from './StudyingPanel.module.css';
import WritingPanel from './WritingPanel/WritingPanel';
import { checkSimilarityOfValues, deepCopy, getWordProgress, shuffle } from '../../../helpers/fucntionsHelp';
import { checkIsWordNew, FinishedView, forPracticeMinWords } from './StudyingHelpers';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { MenuButton } from '../../../helpers/ComponentHelpers';

type Mistake = {
    order: number,
    count: number
}

type StudyingPanelProps = {
    config: Configurations;
    vocabulary: Word[];
    onSave: (value: Word[]) => void;
    setPanel: (panelName: PanelName) => void
}

export default function RepeatPanel(props: StudyingPanelProps) {

    const [dataSet, setDataSet] = useState<Word[]>([]);
    const [studiedOrder, setStudiedOrder] = useState(0);
    const [studiedWord, setStudiedWord] = useState<Word>();
    const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
    const [mode, setMode] = useState('');
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [isMistakeTime, setIsMistakeTime] = useState(false);
    const countdown = useRef<number>(100);
    const maxCount = 4;

    
    const save = () => {
        saveProgress();
        sendCountdown(0);
        props.setPanel('menu')
    }

    const saveProgress = () => {
        if (!checkSimilarityOfValues(props.vocabulary, dataSet)) {
            const data = props.vocabulary.map((w, ind) => {
                const matched = dataSet?.find(d => d.id === w.id);
                return matched ? matched : w;
            })
            props.onSave(data);
        }
    }

    useEffect(() => {
        const formatedVoc = formatVoc();
        setDataSet(formatedVoc);
        countdown.current = (formatedVoc.length > props.config.limitAll) ? props.config.limitAll : formatedVoc.length;
    }, [props.vocabulary])

    const formatVoc = () => {
        let filteredByNotNew = props.vocabulary.filter(w => !checkIsWordNew(w))
        filteredByNotNew.sort((a,b) => a.lastRepeat - b.lastRepeat);

        if (filteredByNotNew.length > props.config.limitAll) {
            filteredByNotNew = filteredByNotNew.slice(0, props.config.limitAll);
        }
        const shuffledData = shuffle(filteredByNotNew);
        return shuffledData;
    }

    useEffect(() => {
        if (dataSet.length > 0) {
            defineWords();
            hideCongrats();
            sendCountdown(countdown.current);
        }
    }, [dataSet, studiedOrder, mistakes])


    const defineWords = () => {
        let position = definePosition();
        setStudiedWord(deepCopy(dataSet[position]));

        const mode = defineMode(dataSet[position]);
        setMode(mode);

        const optionalSet = defineOptionalSet(position);
        setOneIterationWords(optionalSet);
    }

    const definePosition = () => {
        if (mistakes.length && mistakes[0].count === maxCount) {
            setIsMistakeTime(true);
            return mistakes[0].order;
        }
        return studiedOrder;
    }

    const defineMode = (word: Word) => {
        let mode: Repeated | string;
        const { original, translated, writed } = word.repeated;
        mode = original >= translated ? 'translated' : 'original';
        if (props.config.modeWrite) {
            if (mode === 'translated' && translated > writed)
                mode = 'writed';
        }
        return mode;
    }

    const defineOptionalSet = (position: number) => {
        let words: Word[] = [];
        const withoutStudyWordOrderSet = props.vocabulary.filter((i) => i.id !== dataSet[position].id);   // removed word by studyOrder
        const shuffled = shuffle(withoutStudyWordOrderSet);                                         // mixing
        words = shuffled.slice(0, 3);                                                               // cut
        words.push(dataSet[position]);                                                              // added word by studyOrder like first element
        return shuffle(words);
    }

    const update = (isCorrectAnswer: boolean) => {
        if (dataSet && studiedWord) {
            const m = mode as keyof Repeated;
            //save progress or create new mistake
            if (isCorrectAnswer)
                studiedWord.repeated[m] = studiedWord.repeated[m] + 1;
            else
                mistakes.push({ order: studiedOrder, count: 0 });
            // updating data
            studiedWord.lastRepeat = new Date().getTime();
            const updatedData = dataSet.map(w => w.id === studiedWord.id ? studiedWord : w)
            setDataSet(updatedData);
            // set order
            setNextWordOrder();
            // use countdown
            countdown.current = countdown.current - 1;
            // updating mistakes
            if (mistakes.length) {
                if (mistakes[0].count === maxCount)
                    mistakes.shift();
                mistakes.forEach(e => e.count++)
            }
            setMistakes([...mistakes]);
        }
    }

    const setNextWordOrder = () => {
        if (!isMistakeTime) {
            if (dataSet && dataSet.length - 1 === studiedOrder)
                setStudiedOrder(0);
            else
                setStudiedOrder(studiedOrder + 1);
        } else
            setIsMistakeTime(false);
    }

    const hideCongrats = () => window.eventBus.notify('nextWord');
    const sendCountdown = (count: number) => window.eventBus.notify('countdown', count)

    const again = () => {
        setStudiedOrder(0);
        setOneIterationWords([]);
        saveProgress();
    }

    

    const notEnoughView = () => <div className={s.more_words}>
        <p>You should have more than 3 words</p>
        <span>Please add new words in <h3>"My Vocabulary"</h3></span>
    </div>

    const loadingView = () => <div>data is loading...</div>

    const getPanel = () => {
        if (dataSet.length < forPracticeMinWords)
            return notEnoughView();
        else if (countdown.current === 0)
            return <FinishedView onClick={again}/>;
        else if (studiedWord)
            return mode !== 'writed'
                ? <ChoosePanel studyWord={studiedWord} optionalWords={oneIterationWords} mode={mode}
                    onSave={update} noNewNumber={maxNumberDefiningNew} />
                : <WritingPanel studyWord={studiedWord} onSave={update} isHint={props.config.hints} />
        else
            return loadingView();
    }

    return <div className={s.block}>
        <MenuButton executor={save}/>
        {getPanel()}
    </div>
}
