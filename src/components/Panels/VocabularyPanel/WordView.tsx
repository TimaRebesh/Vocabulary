import EditView from "./EditView";
import s from './VocabularyPanel.module.css';
import { Configurations, Word } from '../../Types';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { ThemeContext } from '../../Main';
import { Tooltip } from '../../../helpers/ComponentHelpers';
import { useGetConfigQuery } from "../../../API/configApi";

type WordViewProps = {
    word: Word;
    index: number;
    onSave: (w: Word) => void;
    originals: string[];
    remove: (v: Word) => void;
    isNew: boolean;
    passFocus: () => void;
    order: number;
}

export default function WordView(props: WordViewProps) {
    return (
        <div className={s.item}>
            <ProgressBar progress={props.word} />
            <EditView
                word={props.word}
                onSave={props.onSave}
                originals={props.originals}
                remove={() => props.remove(props.word)}
                focus={props.isNew && props.index === 0}
                passFocus={props.passFocus}
            />
            <RemoveButton onClick={() => props.remove(props.word)} />
        </div>
    )
}

type ProgressBarProps = {
    progress: Word;
}

function ProgressBar(props: ProgressBarProps) {
    const progressStatus = props.progress.repeated.original + props.progress.repeated.translated + props.progress.repeated.writed;
    return (
        <div className={s.progress}>
            {Array.from(Array(maxNumberDefiningNew).keys()).map(el =>
                <div key={el} className={`${s.progress_item} ${progressStatus >= el + 1 ? s.progress_positive : ''}`}>
                </div>
            ).reverse()}
            <Tooltip text={`progress: ${progressStatus}`} />
        </div>
    )
}

function RemoveButton(props: { onClick: () => void }) {
    const theme = (useGetConfigQuery({}).data as Configurations).theme;
    return (
        <div className={s.remove_control + ' ' + s['remove_control_' + theme]} >
            <div className={s.remove_button} onClick={props.onClick}>
                <div>&times;</div>
                <Tooltip text='remove' />
            </div>
        </div>
    )
}
