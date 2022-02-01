import { useGetConfigQuery } from '../../../API/configApi';
import { defineClass } from '../../../helpers/fucntionsHelp';
import { Configurations, PanelName } from '../../Types';
import s from './MenuPanel.module.css';


type MenuPanelProps = {
    setPanel: (panelName: PanelName) => void;
}

export default function MenuPanel({ setPanel }: MenuPanelProps) {
    const theme = (useGetConfigQuery().data as Configurations).theme;
    return (
        <div className={defineClass(s.menu, s[theme])}>
            <button className='button' onClick={() => setPanel('repeat')}>Repeat</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('studyNew')}>Study <span style={{ fontStyle: 'italic', color: '#ffa093' }}>NEW</span> words</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('vocabulary')}>My vocabulary</button>
            <div className={s.space}></div>
            <button className='button' onClick={() => setPanel('settings')}>Settings</button>
        </div>
    )
}
