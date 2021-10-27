import React, { useEffect, useRef, useState } from 'react';
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
    return <button className={`button ${s.go_menu}`} onClick={(e) => executor()}>Menu</button>
}

type TooltipProps = {
    text: string | number;
    theme: string;
}

export function Tooltip({ text, theme }: TooltipProps) {

    const [isFocus, setIsFocus] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const timeout = useRef<number>(0);

    useEffect(() => {
        let parent: any = null;
        const mouseEnter = () => timeout.current = window.setTimeout(()=> setIsFocus(true), 500);
        const mouseLeave = () => {
            window.clearTimeout(timeout.current);
            setIsFocus(false);
        };
        if (divRef) {
            const el = divRef.current as HTMLDivElement;
            parent = el.parentElement;
            parent.style.position = 'relative';
            parent.addEventListener('mouseenter', mouseEnter);
            parent.addEventListener('mouseleave', mouseLeave)
        }
        return () => {
            if (parent) {
                parent.removeEventListener('mouseenter', mouseEnter);
                parent.removeEventListener('mouseleave', mouseLeave);
                if (timeout.current > 0)
                    window.clearTimeout(timeout.current);
            }
        }
    }, [])

    const difinePosition = () => {
        return {}
    }

    return <div ref={divRef}>
        {isFocus &&
            <div className={s.tooltip + ' ' + s['tooltip_' + theme]} style={difinePosition()}>
                {text}
            </div>
        }
    </div>
}
