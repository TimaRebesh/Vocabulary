import { useContext, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../../hooks/redux';
import { changeCheer } from '../../../../store/reducers/cheerSlice';
import { ThemeContext } from '../../../Main';
import { Word } from '../../../Types';
import { hideCongrats, setCheer, StudyingWord } from '../StudyingHelpers';
import s from '../StudyingPanel.module.css';

type WritingProps = {
    studyWord: Word;
    onSave: (isCorrect: boolean) => void;
    isHint: boolean;
}

export default function WritingPanel(props: WritingProps) {

    const [result, setResult] = useState('');

    useEffect(() => {
        setResult('');
    }, [props.studyWord])

    const check = (value: string) => {
        if (value)
            setResult(value);
    }

    const next = () => props.onSave(result === props.studyWord.original);

    return <div className={s.practice_block}>
        {!result
            ? <WritingView studyWord={props.studyWord} onChange={check} isHint={props.isHint} />
            : <ResultView currentWord={props.studyWord} result={result} next={next} />
        }
    </div>
}

type WritingViewProps = {
    studyWord: Word;
    onChange: (value: string) => void;
    isHint: boolean;
}

function WritingView({ studyWord, onChange, isHint }: WritingViewProps) {

    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    const check = () => onChange(inputRef.current?.value as string);

    const getClassInput = () => {
        let className = s.input_word;
        if (isHint && value === studyWord.original)
            className += ' ' + s.input_word_correct;
        return className;
    }

    return <>
        <StudyingWord mode={'translated'} studyWord={studyWord} />
        <div className={s.center + ' ' + s[theme]}>
            <input
                ref={inputRef}
                type='text'
                value={value}
                className={getClassInput()}
                placeholder='enter word'
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={e => ['Enter'].includes(e.key) && check()}
            />
        </div>
        <Hint isHint={isHint} studyWord={studyWord} value={value} setValue={setValue} />
        <div className={s.center}>
            <button className={`button ${s.check}`} onClick={check}>Check</button>
        </div>
    </>
}

type ResultViesProps = {
    currentWord: Word;
    result: string;
    next: () => void;
}

function ResultView({ currentWord, result, next }: ResultViesProps) {

    const dispatch = useAppDispatch();
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    const applyCheer = (key:string) => {
        dispatch(changeCheer(key))
    }

    useEffect(() => {
        nextButtonRef.current?.focus();
        currentWord.original === result && applyCheer(setCheer(currentWord));
    }, [result])

    const click = () => {
        next();
        applyCheer(hideCongrats())
    }

    return <div>
        <div className={s.mistake}>
            <p className={s.mistake_correct}>{currentWord.original}</p>
            {result !== currentWord.original &&
                <>
                    <p className={s.mistake_translate}>{currentWord.translated}</p>
                    <p className={s.mistake_wrong}>{result}</p>
                </>
            }
        </div>
       
            <button
                className={'button '}
                ref={nextButtonRef}
                onClick={next}
                onKeyDown={e => ['Enter'].includes(e.key) && click()}
            >Next</button>
    </div>
}

type HintProps = {
    isHint: boolean;
    studyWord: Word;
    value: string;
    setValue: (v: string) => void
}

function Hint({ isHint, studyWord, value, setValue }: HintProps) {

    const setHint = () => {
        let hint = '';
        for (let i = 0; i <= studyWord.original.length - 1; i++) {
            if (studyWord.original[i] === value[i])
                hint += studyWord.original[i];
            else {
                hint += studyWord.original[i];
                break;
            }
        }
        setValue(hint);
    }

    return <div className={s.hint_block}>
        {isHint && <button className={s.hint_button} onClick={setHint}>hint</button>}
    </div>
}
