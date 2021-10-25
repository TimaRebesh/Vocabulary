import React, { useEffect, useRef, useState } from 'react';
import { Configurations, PanelName, Repeated, Word } from '../../Types';
import ChoosePanel from './ChoosePanel/ChoosePanel';
import s from './StudyingPanel.module.css';
import WritingPanel from './WritingPanel/WritingPanel';
import { deepCopy, getWordProgress, shuffle } from '../../../helpers/fucntionsHelp';
import { checkIsWordNew } from './StudyingHelpers';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import MessagePanel from '../MessagePanel/MessagePanel';
import { MenuButton } from '../../../helpers/ComponentHelpers';

type WordState = {
    id: number;
    repeated: number;
}

type StudyingPanelProps = {
    config: Configurations;
    vocabulary: Word[];
    onSave: (value: Word[]) => void;
    setPanel: (panelName: PanelName) => void
}

const mockWord = {
    id: 123,
    original: 'mock',
    translated: 'mock',
    anothers: [],
    repeated: {
        translated: 6,
        original: 6,
        writed: 6
    },
    lastRepeat: 1,
}


export default function StudyingNewPanel(props: StudyingPanelProps) {

    const [dataSet, setDataSet] = useState<Word[]>([]);
    const [studiedOrder, setStudiedOrder] = useState(100);
    const [studiedWord, setStudiedWord] = useState<Word>();
    const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
    const [mode, setMode] = useState('');
    const repeatWatcher = useRef<WordState[]>([]);
    const [isStudyFinished, setIsStadyFinished] = useState(false);

    const save = () => {
        saveProgress();
        props.setPanel('menu')
    }

    const saveProgress = () => {
        if (dataSet.length > 0) {
            const data = props.vocabulary.map(word => {
                const matched = dataSet?.find(d => d.id === word.id);
                return matched ? matched : word;
            })
            props.onSave(data);
        }
        setIsStadyFinished(false);
        setDataSet([]); 
    }

    useEffect(() => {
        if (props.vocabulary.length === 0)
            return
        const formatedVoc = formatVoc(props.vocabulary);
        repeatWatcher.current = formatedVoc.map(word => ({ id: word.id, repeated: 0 }));
        setStudiedOrder(0);
        setDataSet(formatedVoc);
    }, [props.vocabulary])

    useEffect(() => {
        if (studiedOrder < 100 && dataSet.length > 0)
            defineWords();
    }, [studiedOrder])

    const formatVoc = (collection: Word[]) => {
        let filteredByNew = collection.filter(word => checkIsWordNew(word));
        filteredByNew.sort((a, b) => getWordProgress(a) < getWordProgress(b) ? 1 : -1);

        if (filteredByNew.length > props.config.limitNew)
            filteredByNew = filteredByNew.slice(0, props.config.limitNew);

        let shuffledData = shuffle(filteredByNew);
        if (shuffledData.length === 1)
            shuffledData.push(mockWord);
        return shuffledData;
    }

    const defineWords = () => {
        hideCongrats();
        let order = defineOrder();
        if (order !== studiedOrder) {
            setStudiedOrder(order);
            return
        }
        setStudiedWord(deepCopy(dataSet[order]));

        const mode = defineMode(dataSet[order]);
        setMode(mode);

        const optionalSet = defineOptionalSet(order);
        setOneIterationWords(optionalSet);
    }

    const defineOrder = () => {
        let order = studiedOrder;
        let count = 1;
        while (true) {
            const isWordSuitable = checkIsWordSuitable(order);
            if (count === dataSet.length && !isWordSuitable) {
                setIsStadyFinished(true);
                order = 100;
                break;
            }
            if (isWordSuitable) {
                break;
            } else {
                order = (order === dataSet.length - 1) ? 0 : order + 1;
                count++;
            }
        }
        return order;
    }

    const checkIsWordSuitable = (order: number) => {
        const currentWord = dataSet[order];
        const isStillNew = checkIsWordNew(currentWord);
        const isRepeatedTimeNotFinished = (repeatWatcher.current.find(w => w.id === currentWord.id) as WordState).repeated < 3;
        return isStillNew && isRepeatedTimeNotFinished;
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
        setNextWordOrder();
        changeWatcher();
        if (isCorrectAnswer)
            updateDataSet();
    }

    const setNextWordOrder = () => setStudiedOrder(dataSet.length - 1 === studiedOrder ? 0 : studiedOrder + 1);

    const changeWatcher = () => {
        repeatWatcher.current.forEach(rw => {
            if (rw.id === studiedWord?.id)
                rw.repeated++;
        })
    }

    const updateDataSet = () => {
        if (studiedWord) {
            const m = mode as keyof Repeated;
            studiedWord.repeated[m] = studiedWord.repeated[m] + 1;
            const updatedData = dataSet.map(e => e.id === studiedWord.id ? studiedWord : e)
            setDataSet(updatedData);
        }
    }

    const hideCongrats = () => window.eventBus.notify('nextWord');

    const finishedView = () => <div>
        <p>Study is finished</p>
        <button onClick={saveProgress}>
            <p>Try again</p>
        </button>
    </div>

    const getPanel = () => {
        if (dataSet.length === 0)
            return <MessagePanel firstMes={'You learned all words'}/>
        else if (isStudyFinished)
            return finishedView();
        else if (studiedWord)
            return mode !== 'writed'
                ? <ChoosePanel studyWord={studiedWord} optionalWords={oneIterationWords} mode={mode}
                    onSave={update} noNewNumber={maxNumberDefiningNew} onlyNew />
                : <WritingPanel studyWord={studiedWord} onSave={update} isHint={props.config.hints} />
        else
            return null;
    }

    return <div className={s.block}>
        <MenuButton executor={save}/>
        {getPanel()}
    </div>
}
