import React, { Suspense, useEffect, useRef, useState } from 'react';
import Header from './Header/Header';
import MenuPanel from './Panels/MenuPanel/MenuPanel';
import SettingsPanel from './Panels/SettingsPanel/SettingsPanel';
import { Configurations, PanelName, Word } from './Types';
import s from './Main.module.css';
import { Api } from '../utils/Api';
import AddNewPanel from './Panels/AddNewPanel/AddNewPanel';
import StudyingNewPanel from './Panels/StudyingPanels/StudyingNewPanel';
import RepeatPanel from './Panels/StudyingPanels/RepeatPanel';
import { EventBus } from '../utils/EentBus';
import { forPracticeMinWords } from './Panels/StudyingPanels/StudyingHelpers';
import MessagePanel from './Panels/MessagePanel/MessagePanel';
import { getVocabularyName } from '../helpers/fucntionsHelp';
import { Preloader } from '../helpers/ComponentHelpers';
const VocabularyPanel = React.lazy(() => import('./Panels/VocabularyPanel/VocabularyPanel'));
export const ThemeContext = React.createContext('white');


declare global {
    interface Window { eventBus: EventBus; }
}

export default function Main() {

    const [config, setConfig] = useState<Configurations>();
    const [vocabulary, setVocabulary] = useState<Word[]>();
    const [activePanelName, setActivePanelName] = useState<PanelName>('menu');
    const updatedLocalConfig = useRef(false);

    useEffect(() => {
        window.eventBus = new EventBus();
        setTimeout(() => {
            Api.getConfig()
                .then(r => setConfig(r as Configurations))
                .catch(e => console.log(e))

        }, 500)
    }, [])


    useEffect(() => {
        if (config && !updatedLocalConfig.current) {
                Api.getVocabulary(config.studyTopic)
                    .then(r => setVocabulary(r as Word[]))
                    .catch(e => console.log(e))
        }
        updatedLocalConfig.current = false;
    }, [config])

    const setPanel = (panelName: PanelName) => {
        setActivePanelName(panelName);
    }

    const saveConfig = (config: Configurations, removed: number[], local: boolean = false) => {
        if (local) {
            setConfig(config);
            updatedLocalConfig.current = true;
        } else 
        Api.saveConfig(config, removed)
            .then(r => setConfig(r as Configurations))
            .catch(e => console.log(e))
    }

    const saveVocabulary = (value: Word[]) => {
        Api.saveVocabulary(value, config?.studyTopic as number)
            .then(r => setVocabulary(r as Word[]))
            .catch(e => console.log(e))
    }

    const shooseClass = () => {
        if (activePanelName === 'vocabulary' || activePanelName === 'settings')
            return s.no_center;
        return s.center;
    }

    const shoosePanel = () => {
        if (config && vocabulary) {
            if (['repeat', 'studyNew', 'studyAll'].includes(activePanelName) && vocabulary.length < forPracticeMinWords)
                return <MessagePanel />
            switch (activePanelName) {
                case 'menu':
                    return <MenuPanel setPanel={setPanel} />;
                case 'repeat':
                    return <RepeatPanel config={config} vocabulary={vocabulary} onSave={saveVocabulary} setPanel={setPanel} />;
                case 'studyNew':
                    return <StudyingNewPanel config={config} vocabulary={vocabulary} onSave={saveVocabulary} setPanel={setPanel} />;
                case 'vocabulary':
                    return <Suspense fallback={<Preloader />}>
                        <VocabularyPanel configuration={config} vocabulary={vocabulary} onSave={saveVocabulary}
                            saveConfig={saveConfig} setPanel={setPanel} />
                    </Suspense>
                case 'settings':
                    return <SettingsPanel configuration={config} onSave={saveConfig} setPanel={setPanel} />
                case 'addNew':
                    return <AddNewPanel />
                default: return null;
            }
        }
    }

    return (
        <div className={`${s.main} ${config && config.theme}`}>
            {config && vocabulary
                ? <ThemeContext.Provider value={config.theme}>
                    <Header activePanel={activePanelName} setPanel={setPanel} vocabularyName={getVocabularyName(config)} />
                    <div className={s.panel}>
                        <div className={shooseClass()}>{shoosePanel()}</div>
                    </div>
                    <div className={s.footer}></div>
                </ThemeContext.Provider>
                : <Preloader />
            }
        </div>
    )
}
