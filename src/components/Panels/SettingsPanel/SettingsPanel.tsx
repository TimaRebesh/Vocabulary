import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, NewConfig, PanelName, Topic } from '../../Types';
import s from './SettingsPanel.module.css';
import arrowdown from '../../../../src/assets/images/arrowdown.png';
import remove from '../../../../src/assets/images/close-icon.png';
import { ThemeContext } from '../../Main';
import { checkSimilarityOfValues } from '../../../helpers/fucntionsHelp';
import { MenuButton } from '../../../helpers/ComponentHelpers';

type SettingsProps = {
    configuration: Configurations;
    onSave: (configuration: Configurations, removed: number[], local?: boolean) => void;
    setPanel: (v: PanelName) => void;
}

export default function SettingsPanel({ configuration, onSave, setPanel }: SettingsProps) {

    const [config, setConfig] = useState<Configurations>(configuration);
    const removed = useRef<number[]>([]);
    const [isNeedUpdateLocalConfig, setUpdateLocal] = useState(false);

    const changeConfig = (newConfig: NewConfig[], onlyLocal:boolean = false) => {
        let changedConfig = { ...config } as Configurations;
        newConfig.forEach(nc => {
            changedConfig = { ...changedConfig, [nc.name]: nc.value }
        })
        setConfig({ ...changedConfig });
        if (onlyLocal) 
            setUpdateLocal(true);
    }

    const save = (local?:boolean) => {
        if(local) {
            onSave(config, removed.current, true);
            setUpdateLocal(false)
        }
        else {
            if (!checkSimilarityOfValues(configuration, config))
                onSave(config, removed.current);
            setPanel('menu');
        }
    }

    useEffect(()=> {
        if(isNeedUpdateLocalConfig)
            save(true)
    }, [isNeedUpdateLocalConfig])

    return (
        <div className={`${s.block} ${s[config.theme]}`}>
            <MenuButton executor={save} />
            <div className={s.settings}>
                <LanguageSelector shosen={config.studyLang}
                    onChange={value => changeConfig([
                        { name: 'studyLang', value },
                        { name: 'studyTopic', value: config.vocabularies[value][0]?.id }
                    ])} />
                <Switcher label='Dark Theme' value={config.theme === 'dark'} onChange={value => changeConfig([{ name: 'theme', value: value ? 'dark' : 'white' }], true)} />
                <Switcher label='Writing mode' value={config.modeWrite} onChange={value => changeConfig([{ name: 'modeWrite', value }])} />
                <Switcher label='Show hints' value={config.hints} onChange={value => changeConfig([{ name: 'hints', value }])} />
                <RangeSlider label='Learn all words' value={configuration.limitAll} limit={50} onChange={(value) => changeConfig([{ name: 'limitAll', value }])} />
                <RangeSlider label='Learn new words' value={configuration.limitNew} limit={20} onChange={(value) => changeConfig([{ name: 'limitNew', value }])} />
            </div>
        </div >
    )
}

type VocabularySelectorProps = {
    topics: Topic[];
    studyingTopic: Topic;
    cnangeTopic: (value: number) => void;
    changeAllVoc: (value: Topic, remove?: boolean) => void;
}

function VocabularySelector(props: VocabularySelectorProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);

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

    const switchStudy = (id: number) => {
        props.cnangeTopic(id)
        setIsOpen(false);
    }

    const createNew = () => {
        setIsNew(true);
        setIsOpen(false);
    }

    const saveNew = () => {
        if (inputRef.current && inputRef.current.value) {
            const newTopic = { id: new Date().getTime(), name: inputRef.current.value }
            props.changeAllVoc(newTopic);
        }
    }

    const removeNew = (e: React.FocusEvent<HTMLInputElement>) => setIsNew(false);

    const removeItem = (topic: Topic) => props.changeAllVoc(topic, true);

    const getStadyingName = () => props.studyingTopic?.name || 'you have no one';

    if (isNew)
        return <div className={s.creator_block} onBlur={removeNew}>
            <input ref={inputRef} type='text' className={s.creator_input}></input>
            <div className={s.creator_save} onMouseDown={saveNew} >save</div>
        </div>

    return <div ref={blockRef} className={s.vocabulary_selector}>
        <div className={s.selector}>
            <div className={s.chosen} onClick={() => setIsOpen(!isOpen)}>
                {getStadyingName()}
            </div>
            <div className={s.open_button} onClick={() => setIsOpen(!isOpen)}>
                <img src={arrowdown} alt='open' />
            </div>
        </div>
        {isOpen &&
            <div className={s.list_popup}>
                <div className={s.list_item_create} onClick={createNew}>+ create new</div>
                <div className={s.list_items_block}>
                    {props.topics.map(topic =>
                        <div key={topic.id} className={s.list_item}>
                            <div className={s.list_name}
                                onClick={_ => switchStudy(topic.id)}>{topic.name}
                            </div>
                            <img src={remove} alt='remove' className={s.remove} onClick={_ => removeItem(topic)} />
                        </div>
                    )}
                </div>
            </div>
        }
    </div>
}

type LanguageSelectorProps = {
    shosen: string;
    onChange: (value: string) => void;
}

function LanguageSelector(props: LanguageSelectorProps) {

    const [shosenLang, setChosenLang] = useState(props.shosen);
    const [isOpen, setIsOpen] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);
    const languageNames = ['English', 'Polish', 'Russian'];

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

    const switchLang = (index: number) => {
        props.onChange(languageNames[index]);
        setChosenLang(languageNames[index]);
        setIsOpen(false);
    }

    return <SplitPanel label='Learning Language'>
        <div ref={blockRef} className={s.language_selector}>
            <div className={s.selector} onClick={() => setIsOpen(!isOpen)}>
                <div className={s.chosen} onClick={() => setIsOpen(!isOpen)}>{shosenLang}</div>
                <div className={s.open_button} onClick={() => setIsOpen(!isOpen)}>
                    <img src={arrowdown} alt='open' />
                </div>
            </div>
            {isOpen &&
                <div className={s.list_popup}>
                    {languageNames.map((name, index) =>
                        <div key={name + index} className={s.list_item} onClick={_ => switchLang(index)}>{name}</div>
                    )}
                </div>
            }
        </div>
    </SplitPanel>
}

type LeftRightProsp = {
    label: string;
    children: React.ReactChild;
}

function SplitPanel(props: LeftRightProsp) {
    return (
        <div className={s.block}>
            <div className={s.left_side}>
                <p
                // style={getTheme().forText(theme)}
                >{props.label}</p>
            </div>
            <div className={s.space}></div>
            <div className={s.right_side}>
                {props.children}
            </div>
        </div>
    )
}

type SwitcherProps = {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
}

function Switcher(props: SwitcherProps) {
    const theme = useContext(ThemeContext);
    return <SplitPanel label={props.label}>
        <label className={s.switch}>
            <input
                type='checkbox'
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)} />
            <span className={s.slider}></span>
        </label>
    </SplitPanel>
}

type RangeSliderProps = {
    label: string;
    value: number;
    limit: number;
    onChange: (value: number) => void;
}

function RangeSlider({ value, limit, onChange, label }: RangeSliderProps) {

    const inputRef = useRef<HTMLInputElement>(null);
    const pointerRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = value.toString();
        }
        setPosition(value)
    }, [])

    const setPosition = (value: number) => {
        if (inputRef.current && pointerRef.current) {
            pointerRef.current.innerHTML = value.toString();
            const position = (inputRef.current.offsetWidth / limit) * value - 20;
            pointerRef.current.style.left = position + "px";
        }
    }

    const move = () => {
        setPosition((Number(inputRef.current?.value)))
    }

    return <SplitPanel label={label}>
        <div className={s.rs_container}>
            <div className={s.range_slider}>
                <span ref={pointerRef} className={s.pointer}></span>
                <input ref={inputRef} className={s.rs_range} type='range' min='4' max={limit}
                    onMouseUp={_ => onChange(Number(inputRef.current?.value))}
                    onChange={move}
                />
            </div>
            <div className={s.box_minmax}>
                <span>4</span><span>{limit}</span>
            </div>
        </div>
    </SplitPanel>

}
