import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, NewConfig, Topic } from '../../../Types';
import s from './VocabularySelectors.module.css';
import remove from '../../../../assets/images/close-icon.png';
import arrowdown from '../../../../assets/images/arrowdown.png';

type VocSelectorsProps = {
    config: Configurations;
    saveConfig: (newConfig: Configurations, removed: number[]) => void;
    // cnangeTopic: (newConfig: any) => void;
    // changeAllVoc: (value: Topic, remove?: boolean) => void;

}

export default function VocabularySelectors(props: VocSelectorsProps) {

    const allTopics = props.config.vocabularies[props.config.studyLang];
    const studyTopic = allTopics.find(t => t.id === props.config.studyTopic) as Topic;


    const changeConfig = (newConfig: NewConfig[]) => {
        let changedConfig = { ...props.config } as Configurations;
        newConfig.forEach(nc => {
            changedConfig = { ...changedConfig, [nc.name]: nc.value }
        })
        props.saveConfig({ ...changedConfig }, []);
    }

    const changeVocabularies = (topic: Topic, remove?: boolean) => {
        const config = props.config;
        let currentTopics = [...config.vocabularies[config.studyLang]];
        let removed = [];
        if (remove) {
            currentTopics = currentTopics.filter(t => t.id !== topic.id);
            removed.push(topic.id);
            if (topic.id === config.studyTopic)
                config.studyTopic = currentTopics[0].id;
        } else {
            currentTopics.unshift(topic);
        }
        props.config.vocabularies[config.studyLang] = currentTopics;
        props.saveConfig({ ...config }, removed);
    }

    return <div className={s.selectors_group}>
        <VocabularySelector studyingTopic={studyTopic}
            topics={allTopics}
            cnangeTopic={value => changeConfig([{ name: 'studyTopic', value }])}
            changeAllVoc={changeVocabularies}
        />
        <LanguageSelector shosen={props.config.studyLang}
            onChange={value => changeConfig([
                { name: 'studyLang', value },
                { name: 'studyTopic', value: props.config.vocabularies[value][0]?.id ?? 0 }
            ])} />
    </div>
}

type VocabularySelectorProps = {
    topics: Topic[];
    studyingTopic: Topic;
    cnangeTopic: (value: number) => void;
    changeAllVoc: (value: Topic, remove?: boolean) => void;
}

const VocabularySelector = (props: VocabularySelectorProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        inputRef.current?.focus();
    }, [isNew])

    useEffect(() => {
        const callback = (e: MouseEvent) => {
            if (!blockRef.current?.contains(e.target as HTMLDivElement))
                setIsOpen(false)
        }
        window.addEventListener('click', callback);
        return () => {
            window.removeEventListener('click', callback);
        }
    }, [])

    const switchStudy = (id: number) => {
        props.cnangeTopic(id)
        setIsOpen(false);
    }

    const createNew = () => {
        setIsNew(true);
        setIsOpen(false);
    }

    const saveNew = () => {
        if (inputRef.current && inputRef.current.value) {
            const newTopic = { id: new Date().getTime(), name: inputRef.current.value }
            props.changeAllVoc(newTopic);
        }
    }

    const removeNew = (e: React.FocusEvent<HTMLInputElement>) => setIsNew(false);

    const removeItem = (topic: Topic) => props.changeAllVoc(topic, true);

    const getStadyingName = () => props.studyingTopic?.name ?? 'you have no one';

    const creatorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape')
            setIsNew(false);
    }

    const selectorKeyDown = (e: React.KeyboardEvent) => {
        console.log('keydows')
        if (e.key === 'Escape')
            setIsNew(false);
    }

    useLayoutEffect(() => {
        if (isOpen) {
            console.log('[fdfsf')
            blockRef.current?.focus()
        }
    }, [isOpen])


    if (isNew)
        return <div className={s.creator_block} onKeyDown={creatorKeyDown} onBlur={removeNew}>
            <input ref={inputRef} type='text' className={s.creator_input} placeholder='Create new vocabulary' maxLength={20} />
            <div className={s.creator_save} onMouseDown={saveNew} >save</div>
        </div>

    return <div className={s.selector_block}>
        <div className={s.legend}>Change vocabulary</div>
        <div ref={blockRef} className={s.vocabulary_selector} onKeyDown={selectorKeyDown}>
            <div className={s.selector} onClick={() => setIsOpen(!isOpen)} onKeyDown={selectorKeyDown}>
                <div className={s.chosen} >
                    {getStadyingName()}
                </div>
                <div className={s.open_button} onClick={() => setIsOpen(!isOpen)}>
                    <img src={arrowdown} alt='open' />
                </div>
            </div>
            <SelectorPopup isOpen={isOpen} items={props.topics} choose={switchStudy} onRemove={removeItem}>
                {() => <div className={s.list_item_create} onClick={createNew}>+ create new</div>}
            </SelectorPopup>
        </div>
    </div>
}

type LanguageSelectorProps = {
    shosen: string;
    onChange: (value: string) => void;
}

function LanguageSelector(props: LanguageSelectorProps) {

    const [shosenLang, setChosenLang] = useState(props.shosen);
    const [isOpen, setIsOpen] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);
    const languageNames = ['English', 'Polish', 'Russian'];

    useEffect(() => {
        const callback = (e: MouseEvent) => {
            if (!blockRef.current?.contains(e.target as HTMLDivElement))
                setIsOpen(false)
        }
        window.addEventListener('click', callback);
        return () => {
            window.removeEventListener('click', callback);
        }
    }, [])

    const switchLang = (index: number) => {
        props.onChange(languageNames[index]);
        setChosenLang(languageNames[index]);
        setIsOpen(false);
    }

    return (
        <div className={s.selector_block}>
            <div className={s.legend}>Change learingn lenguage</div>
            <div ref={blockRef} className={s.language_selector}>
                <div className={s.selector} onClick={() => setIsOpen(!isOpen)}>
                    <div className={s.chosen} onClick={() => setIsOpen(!isOpen)}>{shosenLang}</div>
                    <div className={s.open_button} onClick={() => setIsOpen(!isOpen)}>
                        <img src={arrowdown} alt='open' />
                    </div>
                </div>
                <SelectorPopup isOpen={isOpen} choose={switchLang} items={languageNames.map((ln, ind) => ({ id: ind, name: ln }))} />
            </div>
        </div>
    )
}

type SelectorPopupProps = {
    isOpen: boolean;
    items: Topic[];
    choose: (v: number) => void;
    children?: () => JSX.Element;
    onRemove?: (v: Topic) => void;
}

function SelectorPopup(props: SelectorPopupProps) {
    return <>
        {props.isOpen &&
            <div className={s.list_popup}>
                {props.children && props.children()}
                <div className={s.list_items_block}>
                    {props.items.map(item =>
                        <div key={item.id} className={s.list_item}>
                            <div className={s.list_name} onClick={_ => props.choose(item.id)}>
                                {item.name}
                            </div>
                            {props.onRemove &&
                                <img src={remove} alt='remove' className={s.remove}
                                    onClick={_ => props.onRemove && props.onRemove(item)} />
                            }
                        </div>
                    )}
                </div>
            </div>
        }
    </>
}
