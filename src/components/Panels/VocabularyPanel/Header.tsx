import { useLayoutEffect, useRef } from 'react';
import arrowdown from '../../../assets/images/arrowdown.png';
import arrowup from '../../../assets/images/arrowup.png';
import { Configurations, Word } from '../../Types';
import s from './VocabularyPanel.module.css';
import { MenuButton, Spacer } from '../../../helpers/ComponentHelpers';
import VocabularySelector from './VocabularySelectors/VocabularySelector';
import VocabularyEditor from './VocabularyEditor';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setSearch, setSort } from '../../../store/reducers/vocPanelSlice';
import { useGetConfigQuery } from '../../../API/configApi';

type HeaderProps = {
    coutWords: number;
    focus: Object | undefined;
    setNew: (v: boolean) => void;
    save: () => void;
    voc: Word[];
}

export default function Header(props: HeaderProps) {

    const config = useGetConfigQuery({}).data as Configurations;
    const theme = config.theme;

    return (
        <div className={s.header + ' ' + s[theme]}>
            <MenuButton executor={props.save} />
            <Counter count={props.coutWords} />
            <Search />
            <Sort />
            <AddNewWord focus={props.focus} onChange={() => props.setNew(true)} />
            <Spacer />
            <VocabularyEditor voc={props.voc}/>
            <VocabularySelector />
        </div>
    )
}

const Counter = ({ count }: { count: number }) =>
    <div className={s.counter}>
        <div className={s.counter_value}>{count}</div>
    </div>

const Search = () => {

    const { search } = useAppSelector(state => state.vocPanel);
    const dispatch = useAppDispatch();

    return <input type='text' placeholder='Search...' className={s.search}
        value={search} onChange={e => dispatch(setSearch(e.target.value))} />
}


const Sort = () => {

    const { sort } = useAppSelector(state => state.vocPanel);
    const dispatch = useAppDispatch();

    const getSortLabel = () => sort === 'off' ? 'SORT' : (sort === 'asc' ? 'ASC' : 'DESC')

    const chageSort = () => dispatch(setSort(sort === 'off' ? 'asc' : (sort === 'asc' ? 'desc' : 'off')))

    const getLegendClass = () => sort !== 'off' ? s.sort_legend : '';

    return (
        <div className={s.sort}>
            <div className={getLegendClass()}>{getSortLabel()}</div>
            <img
                src={(sort === 'off' || sort === 'asc') ? arrowup : arrowdown}
                alt='ASC'
                onClick={chageSort} />
        </div>
    )
}

const AddNewWord = (props: { focus: Object | undefined; onChange: () => void; }) => {

    const addNewButtonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => addNewButtonRef.current?.focus(), [props.focus]);

    return <button ref={addNewButtonRef} className={s.add_new_word} onClick={props.onChange}>Add new word</button>
}
