import React, { useEffect, useRef, useState } from 'react';
import { Repeated, StudyingPanelProps, Word } from '../../Types';
import ChoosePanel from './ChoosePanel/ChoosePanel';
import WritingPanel from './WritingPanel/WritingPanel';
import { checkSimilarityOfValues, deepCopy, shuffle } from '../../../helpers/fucntionsHelp';
import { checkIsWordNew, defineMode, defineOptionalSet, forPracticeMinWords, hideCongrats } from './StudyingHelpers';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { Preloader } from '../../../helpers/ComponentHelpers';
import MessagePanel from '../MessagePanel/MessagePanel';
import { StudyingPanel } from './StudyingPanel';

type Mistake = {
    order: number,
    count: number
}

export default function RepeatPanel(props: StudyingPanelProps) {

    const [dataSet, setDataSet] = useState<Word[]>([]);
    const [studiedOrder, setStudiedOrder] = useState(0);
    const [studiedWord, setStudiedWord] = useState<Word>();
    const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
    const [mode, setMode] = useState('');
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [isMistakeTime, setIsMistakeTime] = useState(false);
    const countdown = useRef<number>(1000);
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
        filteredByNotNew.sort((a, b) => a.lastRepeat - b.lastRepeat);

        if (filteredByNotNew.length > props.config.limitAll)
            filteredByNotNew = filteredByNotNew.slice(0, props.config.limitAll);

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
        let order = defineOrder();
        setStudiedWord(deepCopy(dataSet[order]));

        const mode = defineMode(dataSet[order], props.config.modeWrite);
        setMode(mode);

        const optionalSet = defineOptionalSet(order, props.vocabulary, dataSet);
        setOneIterationWords(optionalSet);
    }

    const defineOrder = () => {
        if (mistakes.length && mistakes[0].count === maxCount) {
            setIsMistakeTime(true);
            return mistakes[0].order;
        }
        return studiedOrder;
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

    const sendCountdown = (count: number) => window.eventBus.notify('countdown', count)

    const again = () => {
        setStudiedOrder(0);
        setOneIterationWords([]);
        saveProgress();
    }

    const getPanel = () => {
        if (dataSet.length < forPracticeMinWords)
            return <MessagePanel legend={'You should have more than 3 learned words'} messages={[<>Please stady words in <h3>"Stady New only"</h3></>]} />;
        else if (countdown.current === 0)
            return <MessagePanel messages={[<p>Practice is finished</p>]}>
                <button className='button' onClick={again}>Try again</button>
            </MessagePanel>
        else if (studiedWord)
            return mode !== 'writed'
                ? <ChoosePanel studyWord={studiedWord} optionalWords={oneIterationWords} mode={mode}
                    onSave={update} noNewNumber={maxNumberDefiningNew} />
                : <WritingPanel studyWord={studiedWord} onSave={update} isHint={props.config.hints} />
        else
            return <Preloader />;
    }

    return <StudyingPanel getPanel={getPanel} onSave={save} />
}
