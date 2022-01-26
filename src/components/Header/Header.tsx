import { useContext, useEffect } from 'react';
import s from './Header.module.css';
import { PanelName } from '../Types';
import { ThemeContext } from '../Main';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeCheer } from '../../store/reducers/cheerSlice';

type HeaderProps = {
    activePanel: PanelName;
    setPanel: (panelName: PanelName) => void;
    vocabularyName: string;
}

export default function Header({ activePanel, setPanel, vocabularyName }: HeaderProps) {

    const { countdown } = useAppSelector(state => state.countdown);
    const { cheer } = useAppSelector(state => state.cheer);
    const dispatch = useAppDispatch();
    
    const theme = useContext(ThemeContext);

    useEffect(() => {
        dispatch(changeCheer(''));
    }, [activePanel])

    const getLabel = () => {
        switch (activePanel) {
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
