import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import preloader from '../assets/images/preloader.gif';
import s from './Helpers.module.css';
import { useGetConfigQuery } from '../API/configApi';
import { Configurations } from '../components/Types';

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

export function SaveButton({ executor }: { executor: () => void }) {
    return <button className={`button ${s.save}`} onClick={(e) => executor()}>Save</button>
}

type TooltipProps = {
    text: string | number;
}

export function Tooltip({ text }: TooltipProps) {

    const [isFocus, setIsFocus] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const theme = (useGetConfigQuery().data as Configurations).theme;
    const timeout = useRef<number>(0);

    useEffect(() => {
        let parent: any = null;
        const mouseEnter = () => timeout.current = window.setTimeout(() => setIsFocus(true), 500);
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

const modalRoot = document.getElementById('modal-root') as HTMLElement;

type ModalProps = {
    isShown: boolean;
    children: JSX.Element;
}

export const Modal = (props: ModalProps) =>
    ReactDOM.createPortal(
        props.isShown &&
        <div className={s.modal_background}>
            {props.children}
        </div>,
        modalRoot);


type QuestionControlProps = {
    show: boolean;
    hide: () => void;
    text: string;
    onYes: () => void;
}

export function QuestionControl(props: QuestionControlProps) {
    const theme = (useGetConfigQuery().data as Configurations).theme;

    return <Modal isShown={props.show}>
        <div className={s.modal + ' ' + s[theme]}>
            <div className={s.modal_header}>
                <div className={s.modal_close} onClick={props.hide}>&times;</div>
            </div>
            <div className={s.modal_content}>
                <div className={s.modal_text + ' ' + s[theme]}>{props.text}</div>
                <div className={s.modal_buttons}>
                    <button className='button' onClick={props.onYes}>Yes</button>
                    <button className='button' onClick={props.hide}>No</button>
                </div>
            </div>
        </div>
    </Modal>
}
