import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, PanelName, VocMutation, Word } from '../../Types';
import s from './VocabularyPanel.module.css';
import Header from './Header';
import WordView from './WordView';


type VocabularyProps = {
    vocabulary: Word[];
    configuration: Configurations;
    onSave: (v: Word[]) => void;
    saveConfig: (configuration: Configurations, removed: number[]) => void;
    setPanel: (panelName: PanelName) => void;
    saveConfigAndVoc: (val: VocMutation) => void;
}

export default function VocabularyPanel(props: VocabularyProps) {

    const [words, setWords] = useState<Word[]>(props.vocabulary);
    const [originals, setOriginals] = useState<string[]>([]);
    const [isASC, setIsASC] = useState<boolean | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const wordsRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState<undefined | Object>();

    useEffect(() => setWords(props.vocabulary), [props.vocabulary]);

    useLayoutEffect(() => {
        if (wordsRef.current)
            wordsRef.current.style.height = document.documentElement.clientHeight - 150 + 'px';
    }, [])

    useEffect(() => {
        if (isASC !== null)
            if (isASC)
                words.sort((a, b) => a.original > b.original ? 1 : -1);
            else
                words.sort((a, b) => a.original > b.original ? -1 : 1);
        setWords([...words])
    }, [isASC])

    useEffect(() => {
        if (isNew) {
            const newWord = {
                id: getNewID(),
                original: '',
                translated: '',
                anothers: [],
                lastRepeat: 1,
                repeated: { translated: 0, original: 0, writed: 0, }
            }
            setWords([newWord, ...words])
        } else
            setWords([...words]);
    }, [isNew])

    useEffect(() => {
        const isElToRemove = words.find(el => el.id === 0);
        if (isElToRemove)
            setWords(words.filter(el => el.id !== 0))
        else
            setOriginals(words.map(i => i.original));
    }, [words])


    const change = (w: Word) => {
        setWords(words.map(el => el.id === w.id ? { ...w, id: getNewID() } : el));
        setIsNew(false);
    }

    const remove = (w: Word) => {
        setWords(words.map(el => el.id === w.id ? { ...w, id: 0 } : el));
        setIsNew(false);
    }

    const save = () => {
        const withoutEmpty = words.filter(e => (e.original && e.translated));
        props.onSave(withoutEmpty);
        props.setPanel('menu');
    }

    const getNewID = () => new Date().getTime();

    return <>
        <Header
            coutWords={words.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isASC={isASC} setIsASC={setIsASC}
            focus={focus}
            setNew={(v) => setIsNew(v)}
            save={save}
            voc={props.vocabulary}
            config={props.configuration}
            saveConfig={props.saveConfig}
            saveConfigAndVoc={props.saveConfigAndVoc}
        />
        <div ref={wordsRef} className={s.words_block}>
            {words
                .filter(val => {
                    if (!searchTerm)
                        return val;
                    else if (val.original.toLowerCase().includes(searchTerm.toLowerCase()))
                        return val;
                })
                .map((word: Word, index) =>
                    <WordView
                        key={word.original + index}
                        index={index}
                        word={word}
                        onSave={change}
                        originals={originals}
                        isNew={isNew}
                        passFocus={() => setFocus({})}
                        remove={remove}
                        order={words.length - index}
                    />
                )}
        </div>
    </>
}
