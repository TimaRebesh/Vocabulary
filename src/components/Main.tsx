import React, { Suspense, useEffect, useState } from 'react';
import Header from './Header/Header';
import MenuPanel from './Panels/MenuPanel/MenuPanel';
import SettingsPanel from './Panels/SettingsPanel/SettingsPanel';
import { Configurations, PanelName, Vocabulary, VocMutation, Word } from './Types';
import s from './Main.module.css';
import AddNewPanel from './Panels/AddNewPanel/AddNewPanel';
import StudyingNewPanel from './Panels/StudyingPanels/StudyingNewPanel';
import RepeatPanel from './Panels/StudyingPanels/RepeatPanel';
import { EventBus } from '../utils/EentBus';
import { deepCopy, getVocabularyName } from '../helpers/fucntionsHelp';
import { Preloader } from '../helpers/ComponentHelpers';
import { useGetConfigQuery, useUpdateConfigMutation } from '../API/configApi';
import { useLazyGetVocabularyQuery, useUpdateVocabularyMutation } from '../API/vocabularyApi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changePanel } from '../store/reducers/panelsSlice';
const VocabularyPanel = React.lazy(() => import('./Panels/VocabularyPanel/VocabularyPanel'));
export const ThemeContext = React.createContext('white');


declare global {
    interface Window { eventBus: EventBus; }
}

export default function Main() {

    const { data: config } = useGetConfigQuery({});
    const [lastStudyID, setLastStudyID] = useState(0);
    const [trigger, { data: vocabulary }] = useLazyGetVocabularyQuery();
    const [updateConfig, updateConfigStatus] = useUpdateConfigMutation();
    const [updateVocabulary, updateVocabularyStatus] = useUpdateVocabularyMutation();
    const { activePanelName } = useAppSelector(state => state.panels);
    const dispatch = useAppDispatch();

    useEffect(() => {
        config &&
            (!vocabulary || lastStudyID !== config.studyID) &&
            trigger(config.studyID)
    }, [config])

    const setPanel = (panelName: PanelName) => {
        dispatch(changePanel(panelName));
    }

    const saveConfig = (config: Configurations, removed: number[]) => {
        updateConfig(config);
        setLastStudyID(config.studyID);
    }


    const saveVocabulary = (data: Word[]) => {
        const voc = vocabulary as Vocabulary;
        updateVocabulary({
            id: voc.id,
            data: { ...voc, vocabulary: data}
        })
    }

    const saveConfigAndVoc = async (value: VocMutation) => {
        // let updatedConf: Configurations | null = null;
        // let updatedVoc: Word[] | null = null;
        // if (value.name && config) {
        //     const newConf = deepCopy(config) as Configurations;
        //     const newVocTopics = newConf.vocabularies[newConf.studyLang].map((topic) =>
        //         topic.id === newConf.studyTopic ? { ...topic, name: value.name } : topic);
        //     newConf.vocabularies[newConf.studyLang] = newVocTopics;
        //     updatedConf = await Api.saveConfig(newConf, []) as Configurations;
        // }
        // if (value.vocWords)
        //     updatedVoc = await Api.saveVocabulary(value.vocWords, config?.studyTopic as number) as Word[];
        // if (updatedConf)
        //     setConfig(updatedConf);
        // if (updatedVoc)
        //     setVocabulary(updatedVoc);
    }

    const shooseClass = () => {
        if (activePanelName === 'vocabulary' || activePanelName === 'settings')
            return s.no_center;
        return s.center;
    }

    const shoosePanel = () => {
        if (config && vocabulary) {
            switch (activePanelName) {
                case 'menu':
                    return <MenuPanel setPanel={setPanel} />;
                case 'repeat':
                    return <RepeatPanel config={config} vocabulary={vocabulary.vocabulary} onSave={saveVocabulary} setPanel={setPanel} />;
                case 'studyNew':
                    return <StudyingNewPanel config={config} vocabulary={vocabulary.vocabulary} onSave={saveVocabulary} setPanel={setPanel} />;
                case 'vocabulary':
                    return <Suspense fallback={<Preloader />}>
                        <VocabularyPanel configuration={config} vocabulary={vocabulary.vocabulary} onSave={saveVocabulary}
                            saveConfig={saveConfig} setPanel={setPanel} saveConfigAndVoc={saveConfigAndVoc} />
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
                ?
                <ThemeContext.Provider value={config.theme}>
                    <Header activePanel={activePanelName} setPanel={setPanel} vocabularyName={vocabulary.name ?? '- - -'} />
                    <div className={s.panel}>
                        <div className={shooseClass()}>{shoosePanel()}</div>
                    </div>
                    <div className={s.footer}></div>
                </ThemeContext.Provider>
                :
                <Preloader />
            }
        </div>
    )
}
