import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import arrowdown from '../../../assets/images/arrowdown.png';
import arrowup from '../../../assets/images/arrowup.png';
import { Configurations, NewConfig, Topic } from '../../Types';
import s from './VocabularyPanel.module.css';
import { Spacer } from '../../../helpers/ComponentHelpers';
import VocabularySelectors from './VocabularySelectors/VocabularySelectors';

type HeaderProps = {
    coutWords: number;
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    isASC: null | boolean;
    setIsASC: (v: boolean) => void;
    focus: Object | undefined;
    setNew: (v: boolean) => void;
    isChanged: boolean;
    save: () => void;
    config: Configurations;
    saveConfig: (configuration: Configurations, removed: number[]) => void;
}

export default function Header(props: HeaderProps) {

    

    return (
        <div className={s.header}>
            <Counter count={props.coutWords} />
            <Search value={props.searchTerm} onChange={(v) => props.setSearchTerm(v)} />
            <Sort isASC={props.isASC} onChange={() => props.setIsASC(!props.isASC)} />
            <AddNewWord focus={props.focus} onChange={() => props.setNew(true)} />
            <SaveButton isChanged={props.isChanged} onChange={props.save} />
            <Spacer />
            <VocabularySelectors config={props.config} saveConfig={props.saveConfig}/>
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

const SaveButton = (props: { isChanged: boolean, onChange: () => void }) =>
    <>
        {props.isChanged && <button className={s.save} onClick={props.onChange}>Save</button>}
    </>
