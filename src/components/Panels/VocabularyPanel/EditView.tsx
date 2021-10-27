import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../Main';
import { Word } from '../../Types';
import Others from './Others';
import s from './VocabularyPanel.module.css';

type Editor = {
    value: string;
    focus: boolean;
}

type EditViewProps = {
    word: Word;
    onSave: (w: Word) => void;
    originals: string[];
    focus: boolean;
    passFocus: () => void;
    remove: () => void;
}

const mockValue = [{ value: '', focus: false }, { value: '', focus: false }];

export default function EditView(props: EditViewProps) {

    const [editors, setEditors] = useState<Editor[]>(mockValue)

    useEffect(() => {
        setEditors([
            { value: props.word.original, focus: props.focus },         // original is 0 position
            { value: props.word.translated, focus: false }              // translated is 1 position
        ])
    }, [props.word])

    const changeEditords = (indx: number, changer: (val: Editor) => void) => {
        editors.map((e, i) => {
            if (indx === i)
                changer(e)
            return e
        })
        setEditors([...editors])
    }

    const click = (indx: number) => changeEditords(indx, (e: Editor) => { e.focus = true })

    const blur = (indx: number, value: string) => {
        const pos = indx ? 'translated' : 'original';
        props.onSave({ ...props.word, original: editors[0].value, translated: editors[1].value, [pos]: value });
    }

    const keyDown = (indx: number, key: string, value: string) => {
        if (key === 'Escape') {
            blur(indx, value);
            return;
        }
        if (key === 'Enter') {
            if (indx === 0) {
                changeEditords(indx, (e: Editor) => { e.focus = false; e.value = value });
                changeEditords(indx + 1, (e: Editor) => { e.focus = true });
            } else {
                if (key === 'Enter') {
                    blur(indx, value);
                    props.passFocus();
                }
            }
        }
    }

    const saveOthers = (others: string[]) => props.onSave({ ...props.word, anothers: others });

    return <>
        <div className={s.word}>
            {editors.map((ed, index) =>
                <Editor
                    key={ed.value + index}
                    value={ed.value}
                    focus={ed.focus}
                    class={!index ? `${s.original}` : `${s.translated}`}
                    originals={props.originals}
                    click={() => click(index)}
                    blur={(value) => blur(index, value)}
                    keyDown={(key, value) => keyDown(index, key, value)}
                    spacer={!index}
                    placeholder={!index ? 'enter original' : 'enter translate'}
                />
            )}
        </div>
        <Others others={props.word.anothers} onSave={saveOthers} />
    </>
}

type EditorProps = {
    value: string;
    focus: boolean;
    originals: string[];
    click: () => void;
    keyDown: (key: string, value: string) => void;
    blur: (value: string) => void;
    class: string;
    spacer: boolean;
    placeholder: string
}

function Editor(props: EditorProps) {

    const [value, setValue] = useState(props.value);
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const inputWidth = useRef(0);
    const [notification, setNotification] = useState<null | string>(null);
    const existFrase = 'this word has already exist';
    const emptyFrase = 'value can not be empty';
    const theme = useContext(ThemeContext);

    useLayoutEffect(() => {
        if (props.focus)
            inputRef.current?.focus();
        const text = textRef.current;
        if (text)
            inputWidth.current = text.offsetWidth > +(text.style.minWidth) ? text.offsetWidth - 6 : +(text.style.minWidth);
    })

    useEffect(() => {
        setValue(props.value);
    }, [props])

    useEffect(() => {
        if (!value)
            setNotification(emptyFrase);
        else if (props.value !== value && props.originals.includes(value))
            setNotification(existFrase);
        else
            setNotification(null);
    }, [value])

    const onKeyDown = (key: string) => props.keyDown(key, value);
    const onBlur = () => props.blur(value);

    return <>
        <div className={s.editor + ' ' + s['editor_' + theme]}>
            {props.focus
                ? <input
                    ref={inputRef}
                    type='text'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={onBlur}
                    onKeyDown={(e) => onKeyDown(e.key)}
                    style={{ width: inputWidth.current }}
                    placeholder={props.placeholder}
                />
                : <p ref={textRef} className={props.class} onClick={props.click}>{props.value}</p>
            }
            {notification && <div className={s.notification}>{notification}</div>}
        </div>
        {props.spacer && <div style={{ width: 10 }}></div>}
    </>

}
