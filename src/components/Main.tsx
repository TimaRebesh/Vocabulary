import React, { Suspense, useEffect } from 'react';
import Header from './Header/Header';
import MenuPanel from './Panels/MenuPanel/MenuPanel';
import SettingsPanel from './Panels/SettingsPanel/SettingsPanel';
import { PanelName, Vocabulary, Word } from './Types';
import s from './Main.module.css';
import AddNewPanel from './Panels/AddNewPanel/AddNewPanel';
import StudyingNewPanel from './Panels/StudyingPanels/StudyingNewPanel';
import RepeatPanel from './Panels/StudyingPanels/RepeatPanel';
import { Preloader } from '../helpers/ComponentHelpers';
import { useGetConfigQuery } from '../API/configApi';
import { useLazyGetVocabularyQuery, useUpdateVocabularyMutation } from '../API/vocabularyApi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changePanel } from '../store/reducers/panelsSlice';
const VocabularyPanel = React.lazy(() => import('./Panels/VocabularyPanel/VocabularyPanel'));


export default function Main() {

    const { data: config } = useGetConfigQuery();
    const [getVoc, { data: vocabulary }] = useLazyGetVocabularyQuery();
    const [updateVocabulary, updateVocabularyStatus] = useUpdateVocabularyMutation();
    const { activePanelName } = useAppSelector(state => state.panels);
    const dispatch = useAppDispatch();

    useEffect(() => {
        config &&
            !vocabulary && getVoc(config.studyID)
    }, [config])

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

    return (
        <div className={`${s.main} ${config && config.theme}`}>
            {config && vocabulary
                ?
                <>
                    <Header theme={config.theme} vocabularyName={vocabulary.name ?? '- - -'} />
                    <div className={s.panel}>
                        <div className={shooseClass()}>{shoosePanel()}</div>
                    </div>
                    <div className={s.footer}></div>
                </>
                :
                <Preloader />
            }
        </div>
    )
}
