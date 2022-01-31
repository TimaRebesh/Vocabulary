import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Configurations, NewConfig } from '../../Types';
import s from './SettingsPanel.module.css';
import { ThemeContext } from '../../Main';
import { MenuButton, SaveButton } from '../../../helpers/ComponentHelpers';
import { useChangeThemeMutation, useGetConfigQuery, useUpdateConfigMutation } from '../../../API/configApi';
import { useAppDispatch } from '../../../hooks/redux';
import { changePanel } from '../../../store/reducers/panelsSlice';


export default function SettingsPanel() {

    const { data } = useGetConfigQuery({});
    const [config, setConfig] = useState<Configurations>(data as Configurations);
    const dispatch = useAppDispatch();
    const [changeTheme, changeThemeStatus] = useChangeThemeMutation();
    const [changeConfiguration, changeConfigThemeStatus] = useUpdateConfigMutation();
    const [isChanged, setIsChanged] = useState(false);

    const changeConfig = (newConfig: NewConfig[]) => {
        let changedConfig = { ...config } as Configurations;
        newConfig.forEach(nc => {
            changedConfig = { ...changedConfig, [nc.name]: nc.value }
        })
        setConfig({ ...changedConfig });
        setIsChanged(true);
    }

    const goToMenu = () => dispatch(changePanel('menu'));

    const save = async () => {
        setIsChanged(false);
        await changeConfiguration(config);
    }

    const switchTheme = (value: boolean) => {
        const theme = value ? 'dark' : 'white';
        changeConfig([{ name: 'theme', value: theme }]);
        changeTheme(theme);
    }

    return (
        <div className={`${s.block} ${s[config.theme]}`}>
            <MenuButton executor={goToMenu} />
            {isChanged && <SaveButton executor={save} />}
            <div className={s.settings}>
                <Switcher label='Dark mode' value={config.theme === 'dark'} onChange={switchTheme} />
                <Switcher label='Writing mode' value={config.modeWrite} onChange={value => changeConfig([{ name: 'modeWrite', value }])} />
                <Switcher label='Show hints' value={config.hints} onChange={value => changeConfig([{ name: 'hints', value }])} />
                <RangeSlider label='Learn all words' value={config.limitAll} limit={50} onChange={(value) => changeConfig([{ name: 'limitAll', value }])} />
                <RangeSlider label='Learn new words' value={config.limitNew} limit={20} onChange={(value) => changeConfig([{ name: 'limitNew', value }])} />
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
function updateConfig(config: Configurations) {
    throw new Error('Function not implemented.');
}

