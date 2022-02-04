import EditView from "./EditView";
import s from './VocabularyPanel.module.css';
import { Theme, Word } from '../../Types';
import { maxNumberDefiningNew } from '../../../utils/determinant';
import { Tooltip } from '../../../helpers/ComponentHelpers';

type WordViewProps = {
    word: Word;
    index: number;
    onSave: (w: Word) => void;
    originals: string[];
    remove: (v: Word) => void;
    isNew: boolean;
    passFocus: () => void;
    order: number;
    theme: Theme;
}

export default function WordView(props: WordViewProps) {
    return (
        <div className={s.item}>
            <ProgressBar progress={props.word} theme={props.theme}/>
            <EditView
                word={props.word}
                onSave={props.onSave}
                originals={props.originals}
                remove={() => props.remove(props.word)}
                focus={props.isNew && props.index === 0}
                passFocus={props.passFocus}
                theme={props.theme}
            />
            <RemoveButton onClick={() => props.remove(props.word)} theme={props.theme}/>
        </div>
    )
}

type ProgressBarProps = {
    progress: Word;
    theme: Theme;
}

function ProgressBar(props: ProgressBarProps) {
    const progressStatus = props.progress.repeated.original + props.progress.repeated.translated + props.progress.repeated.writed;
    return (
        <div className={s.progress}>
            {Array.from(Array(maxNumberDefiningNew).keys()).map(el =>
                <div key={el} className={`${s.progress_item} ${progressStatus >= el + 1 ? s.progress_positive : ''}`}>
                </div>
            ).reverse()}
            <Tooltip text={`progress: ${progressStatus}`} theme={props.theme}/>
        </div>
    )
}

function RemoveButton(props: { onClick: () => void; theme: Theme }) {
    return (
        <div className={s.remove_control + ' ' + s['remove_control_' + props.theme]} >
            <div className={s.remove_button} onClick={props.onClick}>
                <div>&times;</div>
                <Tooltip text='remove' theme={props.theme}/>
            </div>
        </div>
    )
}
