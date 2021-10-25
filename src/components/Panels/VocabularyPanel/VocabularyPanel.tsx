import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, Word } from '../../Types';
import s from './VocabularyPanel.module.css';
import Header from './Header';
import WordView from './WordView';


type VocabularyProps = {
    vocabulary: Word[];
    configuration: Configurations;
    onSave: (v: Word[]) => void;
    saveConfig: (configuration: Configurations, removed: number[]) => void;
}

export default function VocabularyPanel({ vocabulary, configuration, onSave, saveConfig }: VocabularyProps) {

    const [words, setWords] = useState<Word[]>(vocabulary);
    const [originals, setOriginals] = useState<string[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isASC, setIsASC] = useState<boolean | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const wordsRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState<undefined | Object>();

    useEffect(()=> setWords(vocabulary), [vocabulary]);

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
            words.unshift({
                id: getNewID(),
                original: '',
                translated: '',
                anothers: [],
                lastRepeat: 1,
                repeated: { translated: 0, original: 0, writed: 0, }
            })
        }
        setWords([...words]);
    }, [isNew])

    useEffect(() => {
        const isElToRemove = words.find(el => el.id === 0);
        if (isElToRemove) {
            setWords(words.filter(el => el.id !== 0))
        } else {
            setOriginals(words.map(i => i.original));
            checkIfChanged();
        }
    }, [words])

    const checkIfChanged = () => {
        if (words.length !== vocabulary.length) {
            setIsChanged(true);
        } else {
            let isSame;
            for (let w of words) {
                isSame = vocabulary.find(el => el.id === w.id);
                if (!isSame)
                    break;
            }
            if (!isSame)
                setIsChanged(true);
        }
    }

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
        onSave(withoutEmpty);
        setIsChanged(false);
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
            isChanged={isChanged}
            save={save}
            config={configuration}
            saveConfig={saveConfig}
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
