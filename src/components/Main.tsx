import React, { Suspense, useEffect, useState } from 'react';
import Header from './Header/Header';
import MenuPanel from './Panels/MenuPanel/MenuPanel';
import SettingsPanel from './Panels/SettingsPanel/SettingsPanel';
import { Configurations, PanelName, Vocabulary, Word } from './Types';
import s from './Main.module.css';
import AddNewPanel from './Panels/AddNewPanel/AddNewPanel';
import StudyingNewPanel from './Panels/StudyingPanels/StudyingNewPanel';
import RepeatPanel from './Panels/StudyingPanels/RepeatPanel';
import { MenuButton, Preloader } from '../helpers/ComponentHelpers';
import { useGetConfigQuery } from '../API/configApi';
import { useGetVocabularyQuery, useUpdateVocabularyMutation } from '../API/vocabularyApi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changePanel } from '../store/reducers/panelsSlice';
import { setErrorMessage } from '../helpers/fucntionsHelp';
const VocabularyPanel = React.lazy(() => import('./Panels/VocabularyPanel/VocabularyPanel'));


export default function Main() {

    const { data: config, isFetching: configLoading, error: configError } = useGetConfigQuery();
    const { data: vocabulary, isFetching: vocLoading, error: vocError } = useGetVocabularyQuery(config?.studyID, {
        skip: config === undefined
    });
    const [updateVocabulary] = useUpdateVocabularyMutation();
    const { activePanelName } = useAppSelector(state => state.panels);
    const { error } = useAppSelector(state => state.error);
    const dispatch = useAppDispatch();
    const [isPreloader, setIsPreloader] = useState(false);

    useEffect(() => {
        setIsPreloader(configLoading);
    }, [configLoading])

    useEffect(() => {
        setIsPreloader(vocLoading);
    }, [vocLoading])

    useEffect(() => {
        configError && dispatch(setErrorMessage(configError, 'getConfig'))
        vocError && dispatch(setErrorMessage(vocError, 'getVocabulary'))
    }, [vocError, configError])

    const setPanel = (panelName: PanelName) => {
        dispatch(changePanel(panelName));
    }

    const saveVocabulary = (data: Word[]) => {
        const voc = vocabulary as Vocabulary;
        updateVocabulary({
            id: voc.id,
            data: { ...voc, vocabulary: data }
        })
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
                        <VocabularyPanel vocabulary={vocabulary.vocabulary} onSave={saveVocabulary} setPanel={setPanel} />
                    </Suspense>
                case 'settings':
                    return <SettingsPanel />
                case 'addNew':
                    return <AddNewPanel />
                default: return null;
            }
        }
    }

    const getPanel = () => {
        if (error) {
            return <>
                <h4 className={s.error}>{error}</h4>
                <MenuButton executor={() => { dispatch(setErrorMessage(null)); dispatch(changePanel('menu')) }} />
            </>
        }
        if (config && vocabulary)
            return <>
                <div className={s.panel}>
                    <div className={shooseClass()}>{shoosePanel()}</div>
                    {isPreloader && <Preloader />}
                </div>
                <div className={s.footer}></div>
            </>
        return <Preloader />
    }

    return (
        <div className={`${s.main} ${config && config.theme}`}>
            <Header theme={config?.theme ?? 'white'} vocabularyName={vocabulary?.name ?? '- - -'} />
            {getPanel()}
        </div>
    )
}
