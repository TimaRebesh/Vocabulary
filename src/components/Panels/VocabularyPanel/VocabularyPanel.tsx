import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PanelName, Theme, Word } from '../../Types';
import s from './VocabularyPanel.module.css';
import Header from './Header';
import WordView from './WordView';
import { useAppSelector } from '../../../hooks/redux';


type VocabularyProps = {
    vocabulary: Word[];
    onSave: (v: Word[]) => void;
    setPanel: (panelName: PanelName) => void;
    theme: Theme;
}

export default function VocabularyPanel(props: VocabularyProps) {

    const { sort } = useAppSelector(state => state.vocPanel);
    const { search } = useAppSelector(state => state.vocPanel);
    const [words, setWords] = useState<Word[]>(props.vocabulary);
    const [originals, setOriginals] = useState<string[]>([]);
    const [isNew, setIsNew] = useState(false);
    const wordsRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState<undefined | Object>();

    useEffect(() => setWords(props.vocabulary), [props.vocabulary]);

    useLayoutEffect(() => {
        if (wordsRef.current)
            wordsRef.current.style.height = document.documentElement.clientHeight - 150 + 'px';
    }, [])

    useEffect(() => {
        const wordsCopy = [...words];
        if (sort !== 'off') {
            if (sort === 'asc')
                wordsCopy.sort((a, b) => a.original > b.original ? 1 : -1);
            if (sort === 'desc')
                wordsCopy.sort((a, b) => a.original > b.original ? -1 : 1);
        }
        setWords(wordsCopy)
    }, [sort])

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

    const filteredWords = search ?
        words.filter(val => val.original.toLowerCase().includes(search.toLowerCase()))
        : words;

    return <>
        <Header
            coutWords={words.length}
            focus={focus}
            setNew={(v) => setIsNew(v)}
            save={save}
            voc={props.vocabulary}
         />
        <div ref={wordsRef} className={s.words_block}>
            {filteredWords
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
                        theme={props.theme}
                    />
                )}
        </div>
    </>
}
