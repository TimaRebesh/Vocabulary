import { useContext, useEffect } from 'react';
import s from './Header.module.css';
import { ThemeContext } from '../Main';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeCheer } from '../../store/reducers/cheerSlice';

type HeaderProps = {
    theme: string;
    vocabularyName: string;
}

export default function Header({ theme, vocabularyName }: HeaderProps) {

    const { activePanelName } = useAppSelector(state => state.panels);
    const { countdown } = useAppSelector(state => state.countdown);
    const { cheer } = useAppSelector(state => state.cheer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(changeCheer(''));
    }, [activePanelName])

    const getLabel = () => {
        switch (activePanelName) {
            case ('menu'): return 'Menu';
            case ('settings'): return 'Settings';
            case ('repeat'): return 'Repeat';
            case ('studyNew'): return 'Study new words';
            case ('vocabulary'): return 'My vocabulary';
            default: return '---';
        }
    }

    return <div className={`${s.header} ${s[theme]}`}>
        <div className={s.left_side}></div>
        <div className={s.center}>
            <p>{getLabel()}</p>
            {countdown > 0 &&
                <div className={s.counter}>
                    <div className={s.counter_value}>{countdown}</div>
                </div>}
            {cheer && <div className={s.congrats}>{cheer}</div>}
        </div>
        <div className={s.right_side}>
            <div className={s.vocabulary_name}>'{vocabularyName}'</div>
        </div>
    </div>
}
