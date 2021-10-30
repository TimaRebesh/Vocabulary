import React from 'react';
import { MenuButton } from "../../../helpers/ComponentHelpers";
import s from './StudyingPanel.module.css';


type StudyingProps = {
    onSave: () => void;
    getPanel: () => JSX.Element;
}

export function StudyingPanel(props: StudyingProps) {
    return (
        <div className={s.block}>
            <MenuButton executor={props.onSave} />
            {props.getPanel()}
        </div>
    )
}
