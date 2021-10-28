import React, { useContext } from 'react';
import { defineClass } from '../../../helpers/fucntionsHelp';
import { ThemeContext } from '../../Main';
import { PanelName } from '../../Types';
import s from './MenuPanel.module.css';


type MenuPanelProps = {
    setPanel: (panelName: PanelName) => void;
}

export default function MenuPanel({ setPanel }: MenuPanelProps) {
    const theme = useContext(ThemeContext);
    return (
        <div className={defineClass(s.menu, s[theme])}>
            <button className='button' onClick={() => setPanel('repeat')}>Repeat</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('studyNew')}>Study <span style={{ fontStyle: 'italic', color: '#ffa093' }}>NEW</span> only</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('vocabulary')}>My vocabulary</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('settings')}>Settings</button>
        </div>
    )
}
