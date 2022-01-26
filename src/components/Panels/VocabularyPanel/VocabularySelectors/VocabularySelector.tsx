import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, Topic } from '../../../Types';
import s from './VocabularySelectors.module.css';
import remove from '../../../../assets/images/close-icon.png';
import arrowdown from '../../../../assets/images/arrowdown.png';
import { QuestionControl } from '../../../../helpers/ComponentHelpers';
import { useChangeTopicMutation, useGetConfigQuery, useUpdateVocsInConfigMutation } from '../../../../API/configApi';
import { useCreateVocabularyMutation, useRemoveVocabularyMutation } from '../../../../API/vocabularyApi';

export default function VocabularySelector() {

    const { data, isSuccess } = useGetConfigQuery({});
    const config = data as Configurations;
    const [isOpen, setIsOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isRemoveTopic, setIsRemoveTopic] = useState<Topic | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);
    const [createNewVoc, createNewVocStatus] = useCreateVocabularyMutation();
    const [updateVocInConfig, updateVocInConfigStatus] = useUpdateVocsInConfigMutation();
    const [removeVoc, removeVocStatus] = useRemoveVocabularyMutation();

    useLayoutEffect(() => {
        inputRef.current?.focus();
    }, [isNew])

    useEffect(() => {
        const callback = (e: MouseEvent) => {
            if (!blockRef.current?.contains(e.target as HTMLDivElement))
                setIsOpen(false)
        }
        window.addEventListener('click', callback);
        return () => {
            window.removeEventListener('click', callback);
        }
    }, [])

    const [change] = useChangeTopicMutation();

    const switchStudy = async (id: number) => {
        await change(id).unwrap;
        setIsOpen(false);
    }

    const createNew = () => {
        setIsNew(true);
        setIsOpen(false);
    }

    const saveNew = async () => {
        if (inputRef.current && inputRef.current.value) {
            const response = await createNewVoc(inputRef.current.value) as { data: { id: number, name: string } };
            const { id, name } = response.data
            await updateVocInConfig([
                ...config.vocabularies,
                { id, name }
            ]).unwrap;
        }
    }

    const removeNew = (e: React.FocusEvent<HTMLInputElement>) => setIsNew(false);

    const [changeTopic, changeTopicState] = useChangeTopicMutation();

    const removeItem = async () => {
        if (isRemoveTopic && config.vocabularies.length > 1) {
            if (isRemoveTopic.id === config.studyID) {
                await changeTopic(isRemoveTopic.id === config.vocabularies[0].id ? config.vocabularies[1].id : config.vocabularies[0].id).unwrap;
            }
            await removeVoc(isRemoveTopic.id).unwrap;
            const updatedVocs = config.vocabularies.filter(v => v.id !== isRemoveTopic.id);
            await updateVocInConfig(updatedVocs).unwrap;
            setIsRemoveTopic(null);
        }
    }

    const getStadyingName = () => config.vocabularies.find(v => v.id === config.studyID)?.name ?? 'you have no one';

    const creatorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape')
            setIsNew(false);
    }

    const selectorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape')
            setIsNew(false);
    }

    useLayoutEffect(() => {
        if (isOpen) {
            blockRef.current?.focus()
        }
    }, [isOpen])


    if (isNew)
        return <div className={s.creator_block} onKeyDown={creatorKeyDown} onBlur={removeNew}>
            <input ref={inputRef} type='text' className={s.creator_input} placeholder='Create new vocabulary' maxLength={20} />
            <div className={s.creator_save} onMouseDown={saveNew} >save</div>
        </div>

    return <div className={s.selector_block}>
        <div className={s.legend}>Change vocabulary</div>
        <div ref={blockRef} className={s.vocabulary_selector} onKeyDown={selectorKeyDown}>
            <div className={s.selector} onClick={() => setIsOpen(!isOpen)} onKeyDown={selectorKeyDown}>
                <div className={s.chosen} >
                    {getStadyingName()}
                </div>
                <div className={s.open_button} onClick={() => setIsOpen(!isOpen)}>
                    <img src={arrowdown} alt='open' />
                </div>
            </div>
            <SelectorPopup isOpen={isOpen} items={config.vocabularies} choose={switchStudy} onRemove={(topic) => setIsRemoveTopic(topic)}>
                {() => <div className={s.list_item_create} onClick={createNew}>+ create new</div>}
            </SelectorPopup>
        </div>
        <QuestionControl
            show={isRemoveTopic !== null}
            hide={() => setIsRemoveTopic(null)}
            text={`Do you realy want to remove '${isRemoveTopic?.name}' vocabulary?`} onYes={removeItem} />
    </div>
}

type SelectorPopupProps = {
    isOpen: boolean;
    items: Topic[];
    choose: (v: number) => void;
    children?: () => JSX.Element;
    onRemove?: (v: Topic) => void;
}

function SelectorPopup(props: SelectorPopupProps) {
    return <>
        {props.isOpen &&
            <div className={s.list_popup}>
                {props.children && props.children()}
                <div className={s.list_items_block}>
                    {props.items.map(item =>
                        <div key={item.id} className={s.list_item}>
                            <div className={s.list_name} onClick={_ => props.choose(item.id)}>
                                {item.name}
                            </div>
                            {props.onRemove &&
                                <img src={remove} alt='remove' className={s.remove}
                                    onClick={_ => props.onRemove && props.onRemove(item)} />
                            }
                        </div>
                    )}
                </div>
            </div>
        }
    </>
}
