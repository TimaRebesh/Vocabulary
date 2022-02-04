import React, { useEffect, useRef, useState } from 'react';
import s from './VocabularyPanel.module.css';
import close from '../../../assets/images/close.png';

type OthersProps = {
    others: string[];
    onSave: (v: string[]) => void;
}

export default function Others({ others, onSave }: OthersProps) {

    const [othersWords, setOthersWords] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [inputVal, setInputVal] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => setOthersWords(others), [others])

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            const callback = (e: any) => {
                if (!popupRef.current?.contains(e.target))
                    closePopup()
            }
            document.addEventListener('click', callback);
            return () => document.removeEventListener('click', callback)
        }
    }, [isOpen])

    const closePopup = () => {
        setIsOpen(false);
        setInputVal('')
    }

    const save = () => {
        if (inputVal.length > 0) {
            onSave([inputVal, ...othersWords]);
        }
        setInputVal('');
    }

    const keydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') save();
    }

    const remove = (index: number) => onSave(othersWords.filter((e, i) => i !== index));

    return <div className={s.others_block}>
        {isOpen
            ? <div ref={popupRef} className={s.list} >
                <input
                    ref={inputRef}
                    type='tex'
                    className={s.list_input}
                    placeholder='enter new word'
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={keydown}
                />
                <div className={s.list_popup}>
                    {othersWords.map((opt, i) =>
                        <div key={opt + i} className={s.list_item}>
                            <p>{opt}</p>
                            <img src={close} className={s.list_remove} onClick={() => remove(i)} />
                        </div>
                    )}
                </div>
            </div>
            : <>
                <button className={s.edit} onClick={_ => setIsOpen(true)}>hints</button>
                {othersWords.length > 0 && othersWords.map(o => <p className={s.others} key={o}>{o},</p>)}
            </>
        }
    </div>
}
