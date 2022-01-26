import React, { useContext, useLayoutEffect, useRef } from 'react';
import arrowdown from '../../../assets/images/arrowdown.png';
import arrowup from '../../../assets/images/arrowup.png';
import { Configurations, VocMutation, Word } from '../../Types';
import s from './VocabularyPanel.module.css';
import { MenuButton, Spacer } from '../../../helpers/ComponentHelpers';
import VocabularySelector from './VocabularySelectors/VocabularySelector';
import { ThemeContext } from '../../Main';
import VocabularyEditor from './VocabularyEditor';

type HeaderProps = {
    coutWords: number;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    isASC: null | boolean;
    setIsASC: (v: boolean) => void;
    focus: Object | undefined;
    setNew: (v: boolean) => void;
    save: () => void;
    voc: Word[];
    config: Configurations;
    saveConfig: (configuration: Configurations, removed: number[]) => void;
    saveConfigAndVoc: (val: VocMutation) => void;
}

export default function Header(props: HeaderProps) {

    const theme = useContext(ThemeContext);

    return (
        <div className={s.header + ' ' + s[theme]}>
            <MenuButton executor={props.save} />
            <Counter count={props.coutWords} />
            <Search value={props.searchTerm} onChange={(v) => props.setSearchTerm(v)} />
            <Sort isASC={props.isASC} onChange={() => props.setIsASC(!props.isASC)} />
            <AddNewWord focus={props.focus} onChange={() => props.setNew(true)} />
            <Spacer />
            <VocabularyEditor config={props.config} voc={props.voc} saveConfigAndVoc={props.saveConfigAndVoc} />
            <VocabularySelector />
        </div>
    )
}

const Counter = ({ count }: { count: number }) =>
    <div className={s.counter}>
        <div className={s.counter_value}>{count}</div>
    </div>

const Search = ({ value, onChange }: { value: string; onChange: (v: string) => void }) =>
    <input type='text' placeholder='Search...' className={s.search}
        value={value} onChange={e => onChange(e.target.value)} />

const Sort = (props: { isASC: null | boolean; onChange: () => void }) => {

    const getSortLabel = () => {
        if (props.isASC === null)
            return 'SORT'
        if (props.isASC)
            return 'ASC'
        else
            return 'DESC'
    }

    return (
        <div className={s.sort}>
            <div>{getSortLabel()}</div>
            <img src={props.isASC ? arrowdown : arrowup} alt='ASC' onClick={props.onChange} />
        </div>
    )
}

const AddNewWord = (props: { focus: Object | undefined; onChange: () => void; }) => {

    const addNewButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => addNewButtonRef.current?.focus(), [props.focus]);

    return <button ref={addNewButtonRef} className={s.add_new_word} onClick={props.onChange}>Add new word</button>
}
