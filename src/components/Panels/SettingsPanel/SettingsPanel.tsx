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

    const changeConfig = (newConfig: NewConfig[]) => {
        let changedConfig = { ...config } as Configurations;
        newConfig.forEach(nc => {
            changedConfig = { ...changedConfig, [nc.name]: nc.value }
        })
        setConfig({ ...changedConfig });
    }

    const save = () => {
        if (!checkSimilarityOfValues(configuration, config))
            onSave(config, removed.current);
        setPanel('menu');
    }

    return (
        <div className={`${s.block} ${s[config.theme]}`}>
            <MenuButton executor={save} />
            <div className={s.settings}>
                <Switcher label='Dark mode' value={config.theme === 'dark'} onChange={value => changeConfig([{ name: 'theme', value: value ? 'dark' : 'white' }])} />
                <Switcher label='Writing mode' value={config.modeWrite} onChange={value => changeConfig([{ name: 'modeWrite', value }])} />
                <Switcher label='Show hints' value={config.hints} onChange={value => changeConfig([{ name: 'hints', value }])} />
                <RangeSlider label='Learn all words' value={configuration.limitAll} limit={50} onChange={(value) => changeConfig([{ name: 'limitAll', value }])} />
                <RangeSlider label='Learn new words' value={configuration.limitNew} limit={20} onChange={(value) => changeConfig([{ name: 'limitNew', value }])} />
            </div>
        </div >
    )
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
