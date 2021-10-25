import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Word } from '../../../Types';
import { checkIsWordNew, setCheer, StudyingWord } from '../StudyingHelpers';
import s from '../StudyingPanel.module.css';

type ChooseProps = {
    studyWord: Word;
    optionalWords: Word[];
    mode: string;
    onSave: (isCorrect: boolean) => void;
    noNewNumber: number;
    onlyNew?: boolean;
}

export default function ChoosePanel(props: ChooseProps) {

    const [chosenID, setChosenID] = useState(0);
    const buttonsGroupRef = useRef<HTMLDivElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const callback = (e: any) => {
            if (e.target.localName === 'button')
                e.target.focus();
        }
        buttonsGroupRef.current?.addEventListener('mouseover', callback)
        return () => {
            buttonsGroupRef.current?.removeEventListener('mouseover', callback)
        }
    }, [])

    useEffect(() => {
        if (chosenID !== 0)
            nextButtonRef.current?.focus();
    }, [chosenID])


    useEffect(() => {
        const div = buttonsGroupRef.current as HTMLDivElement;
        const button = div.children[0] as HTMLButtonElement
        button?.focus();
    }, [props.optionalWords])

    const buttonStatus = (id: number) => {
        if (chosenID === props.studyWord.id && chosenID === id)
            return `${s.button} ${s.correct}`
        if (chosenID !== props.studyWord.id && chosenID === id)
            return `${s.button} ${s.wrong}`
        if (chosenID > 0 && chosenID !== props.studyWord.id && props.studyWord.id === id)
            return `${s.button} ${s.show_correct}`
        return s.button
    }

    const check = (id: number) => {
        setChosenID(id);
        if (id === props.studyWord.id)
            setCheer(props.studyWord);
    }

    const next = () => {
        props.onSave(chosenID === props.studyWord.id);
        setChosenID(0);
    }

    const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowDown') {
            const elFocusID = +(document.activeElement as HTMLButtonElement).id;
            if (elFocusID === props.optionalWords.length - 1)
                ((buttonsGroupRef.current as HTMLDivElement).children[0] as HTMLButtonElement).focus();
            else
                ((buttonsGroupRef.current as HTMLDivElement).children[elFocusID + 1] as HTMLButtonElement).focus();
        }
        if (e.key === 'ArrowUp') {
            const elFocusID = +(document.activeElement as HTMLButtonElement).id;
            if (elFocusID > 0)
                ((buttonsGroupRef.current as HTMLDivElement).children[elFocusID - 1] as HTMLButtonElement).focus();
            else
                ((buttonsGroupRef.current as HTMLDivElement).children[props.optionalWords.length - 1] as HTMLButtonElement).focus();
        }
    }

    return <>
        <StudyingWord mode={props.mode} studyWord={props.studyWord} />
        <div ref={buttonsGroupRef} className={s.buttons_group} onKeyDown={keyDown}>
            {props.optionalWords.map((o, order) =>
                <button className={buttonStatus(o.id)}
                    key={o.id}
                    id={order.toString()}
                    onClick={() => check(o.id)}
                    disabled={chosenID > 0}
                    style={{ pointerEvents: chosenID > 0 ? 'none' : 'auto' }}
                >{props.mode === 'original' ? o['translated'] : o['original']}</button>)
            }
        </div>
        {chosenID > 0 &&
            <div className={s.next_button}>
                <button ref={nextButtonRef} onClick={next}>Next</button>
            </div>
        }
    </>
}
