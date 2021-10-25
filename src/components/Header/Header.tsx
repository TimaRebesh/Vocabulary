import React, { useContext, useEffect, useState } from 'react';
import s from './Header.module.css';
import { PanelName } from '../Types';
import { ThemeContext } from '../Main';

type HeaderProps = {
    activePanel: PanelName;
    setPanel: (panelName: PanelName) => void;
    vocabularyName: string;
}

export default function Header({ activePanel, setPanel, vocabularyName }: HeaderProps) {

    const [isShowCongrats, setIsShowCongrats] = useState('');
    const [countdown, setCountdown] = useState(0);
    const cheer = ['good job', 'well done', 'excellent', 'very good', 'perferct', 'congrats'];
    const getCheer = () => cheer[Math.floor(Math.random() * cheer.length)];
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const executorStydied = () => setIsShowCongrats('you learned this word');
        const executorNextWord = () => setIsShowCongrats('');
        const executorCheer = () => setIsShowCongrats(getCheer());
        const executorCountdown = (count: number) => setCountdown(count);
        const unregisterStydied = window.eventBus.register({ name: 'stydied', executor: executorStydied });
        const unregisterNextWord = window.eventBus.register({ name: 'nextWord', executor: executorNextWord });
        const unregisterCheer = window.eventBus.register({ name: 'cheer', executor: executorCheer });
        const unregisterCountdown = window.eventBus.register({ name: 'countdown', executor: executorCountdown })
        return () => {
            unregisterStydied();
            unregisterNextWord();
            unregisterCheer();
            unregisterCountdown();
        }
    }, [])

    useEffect(() => {
        setIsShowCongrats('');
    }, [activePanel])

    const getLabel = () => {
        switch (activePanel) {
            case ('menu'): return 'Menu';
            case ('settings'): return 'Settings';
            case ('studyAll'): return 'Studying';
            case ('studyNew'): return 'Study new words';
            case ('repeat'): return 'Repeat';
            case ('vocabulary'): return 'My vocabulary';
            default: return '---';
        }
    }

    return <div className={`${s.header} ${s[theme]}`}>
        <div className={s.left_side}>
            {/* {activePanel !== 'menu' && <button onClick={() => setPanel('menu')}>Menu</button>} */}
        </div>
        <div className={s.center}>
            <p>{getLabel()}</p>
            {countdown > 0 &&
                <div className={s.counter}>
                    <div className={s.counter_value}>{countdown}</div>
                </div>}
            {isShowCongrats && <div className={s.congrats}>{isShowCongrats}</div>}
        </div>
        <div className={s.right_side}>
            <div className={s.vocabulary_name}>'{vocabularyName}'</div>
        </div>
    </div>
}
