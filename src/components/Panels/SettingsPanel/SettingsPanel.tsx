import React, { useLayoutEffect, useRef, useState } from 'react';
import { Configurations, NewConfig } from '../../Types';
import s from './SettingsPanel.module.css';
import { MenuButton } from '../../../helpers/ComponentHelpers';
import configApi, { useGetConfigQuery, useUpdateConfigMutation } from '../../../API/configApi';
import { useAppDispatch } from '../../../hooks/redux';
import { changePanel } from '../../../store/reducers/panelsSlice';

const mockConfig: Configurations = {
    studyID: 1,
    vocabularies: [{
        id: 1,
        name: 'mocVoc1',
    }, {
        id: 2,
        name: 'mocVoc2',
    }],
    modeWrite: true,
    hints: true,
    limitAll: 30,
    limitNew: 10,
    theme: 'white'
}

export default function SettingsPanel() {

    const config = useGetConfigQuery().data ?? mockConfig;
    const [localConfig, setLocalConfig] = useState(config);
    const [changeConfiguration] = useUpdateConfigMutation();
    const dispatch = useAppDispatch();

    const changeConfig = (newConfig: NewConfig) => {
        const changedConfig = { ...localConfig, [newConfig.name]: newConfig.value } as Configurations;
        setLocalConfig({ ...changedConfig });
    }

    const checkIsConfigChanged = () => {
        let isSame = true;
        for (let k in localConfig) {
            const key = k as keyof Configurations;
            if (localConfig[key] !== config[key]) {
                isSame = false
            }
        }
        return isSame
    }

    const goToMenu = async () => {
        dispatch(changePanel('menu'));
        const isSame = checkIsConfigChanged();
        if (!isSame)
            await changeConfiguration({ ...localConfig, theme: config.theme })
    }

    const switchTheme = async (value: boolean) => {
        const theme = value ? 'dark' : 'white';
        dispatch(
            configApi.util.updateQueryData('getConfig', undefined, (draft) => {
                Object.assign(draft, { theme })
            })
        )
    }

    return <>
        {config &&
            <div className={`${s.block} ${s[config.theme]}`}>
                <MenuButton executor={goToMenu} />
                <div className={s.settings}>
                    <Switcher label='Dark mode' value={config.theme === 'dark'} onChange={switchTheme} />
                    <Switcher label='Writing mode' value={localConfig.modeWrite} onChange={value => changeConfig({ name: 'modeWrite', value })} />
                    <Switcher label='Show hints' value={localConfig.hints} onChange={value => changeConfig({ name: 'hints', value })} />
                    <RangeSlider label='Repeat words' value={localConfig.limitAll} limit={50} onChange={(value) => changeConfig({ name: 'limitAll', value })} />
                    <RangeSlider label='Study new words' value={localConfig.limitNew} limit={20} onChange={(value) => changeConfig({ name: 'limitNew', value })} />
                </div>
            </div >}
    </>
}

type LeftRightProsp = {
    label: string;
    children: React.ReactChild;
}

function SplitPanel(props: LeftRightProsp) {
    return (
        <div className={s.block}>
            <div className={s.left_side}>
                <p>{props.label}</p>
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


