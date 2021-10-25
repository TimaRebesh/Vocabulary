import React from 'react';
import preloader from '../assets/images/preloader.gif';
import s from './Helpers.module.css';

export function Preloader({ info }: { info?: string }) {
    return <div className={s.preloader_block}>
        <div className={s.preloader_content}>
            <img src={preloader} />
            <p>{info}</p>
        </div>
    </div>
}

export function Spacer() {
    return <div className={s.spacer}></div>
}

export function MenuButton({ executor }: { executor: () => void }) {
    return <button className={s.go_menu} onClick={executor}>Menu</button>
}
