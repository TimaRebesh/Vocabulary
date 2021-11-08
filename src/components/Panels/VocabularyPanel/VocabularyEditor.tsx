import React, { useContext, useRef, useState } from 'react';
import * as XLSX from "xlsx"; // npm install xlsx
import s from './VocabularyPanel.module.css';
import edit from '../../../assets/images/edit_list.png'
import { Modal } from '../../../helpers/ComponentHelpers';
import { ThemeContext } from '../../Main';
import { Configurations, VocMutation, Word } from '../../Types';
import { getVocabularyName, getWordProgress } from '../../../helpers/fucntionsHelp';
import Excel from '../../../assets/images/excel.png';

type VocabularyEditorProps = {
    config: Configurations;
    voc: Word[];
    saveConfigAndVoc: (val: VocMutation) => void;
}

export default function VocabularyEditor(props: VocabularyEditorProps) {

    const [isShowPopup, setShowPopup] = useState(false);

    return <>
        <img src={edit} className={s.edit_button} onClick={_ => setShowPopup(true)}></img>
        {isShowPopup &&
            <VocEditorModal
                vocName={getVocabularyName(props.config)}
                voc={props.voc}
                show={isShowPopup}
                hide={() => setShowPopup(false)}
                onSave={props.saveConfigAndVoc} />
        }
    </>
}

type VocEditorModalProps = {
    vocName: string;
    voc: Word[];
    show: boolean;
    hide: () => void;
    onSave: (v: VocMutation) => void;
}

export function VocEditorModal(props: VocEditorModalProps) {

    const theme = useContext(ThemeContext);
    const [inputVal, setInputVal] = useState(props.vocName);
    const [importedVoc, setImportedVod] = useState<Word[]>([]);

    const save = () => {
        const vocMutation: VocMutation = {
            name: '',
            vocWords: null,
        }
        if (inputVal !== props.vocName)
            vocMutation.name = inputVal;
        if (importedVoc.length > 0)
            vocMutation.vocWords = importedVoc;
        props.onSave(vocMutation);
        props.hide();
    }

    return <Modal isShown={props.show}>
        <div className={s.ve_modal + ' ' + s[theme]}>
            <div className={s.ve_header}>
                <p>{props.vocName} vocabulary</p>
                <div className={s.ve_close} onClick={props.hide}>&times;</div>
            </div>
            <div className={s.ve_content}>
                <div>Edit name</div>
                <input type='text' value={inputVal} onChange={e => setInputVal(e.target.value)} />
                <ExportToExcel voc={props.voc} vocName={props.vocName} />
                <ImportFromExcel setData={(voc: Word[]) => setImportedVod(voc)} />
                <div className={s.ve_buttons}>
                    <button className='button' onClick={save}>Apply</button>
                    <button className='button' onClick={props.hide}>Cancel</button>
                </div>
            </div>
        </div>
    </Modal>
}

type ExportToExcelProps = {
    vocName: string;
    voc: Word[];
}

function ExportToExcel(props: ExportToExcelProps) {

    const getFormatedData = () =>
        props.voc.map(w => {
            const data: any = {
                original: w.original,
                translated: w.translated,
                progress: getWordProgress(w),
            }
            w.anothers.forEach((an, count) => {
                data['other_' + (count + 1)] = an;
            })
            return data
        })


    const exportToCSV = (data: object[]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        XLSX.writeFile(wb, props.vocName.concat('.xlsx'))
    }

    return <ExcelButton text='Export to excel' onClick={() => exportToCSV(getFormatedData())} />
}

function ImportFromExcel(props: { setData: (d: Word[]) => void; }) {

    const notValidText = 'This file is not valid';
    const [fileName, setFileName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files as FileList;
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target?.result;
            let readedData = XLSX.read(data, { type: 'binary' });
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
            /* Convert array to json*/
            const dataParse: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
            if (!isDataValid(dataParse[0])) {
                setFileName(notValidText);
                props.setData([]);
            }
            else {
                const formatedData = formatData(dataParse);
                setFileName(files[0].name);
                props.setData(formatedData);
            }
        };
        reader.readAsBinaryString(files[0])
    }

    const isDataValid = (data: string[]) =>
        (data.length >= 3) && (data.slice(0, 3).join('-') === 'original-translated-progress');


    const formatData = (data: object[]) =>
        data.reduce((voc: any, item: any, ind) => {
            if (ind === 0)
                return voc;
            const [original, translated, progress, ...anothers] = item;
            if (!original || !translated)
                return voc;
            const word: Word = {
                id: ind,
                original,
                translated,
                anothers,
                repeated: setPropgress(progress),
                lastRepeat: 1
            }
            return [...voc, word]
        }, [])

    const setPropgress = (propgress: number) => {
        let translated = 0;
        let original = 0;
        let writed = 0;
        const res = propgress % 3
        switch (res) {
            case (0): {
                const value = propgress / 3;
                original = value;
                translated = value;
                writed = value;
                break;
            }
            case (1): {
                const value = Math.trunc(propgress / 3);
                original = value;
                translated = value + 1;
                writed = value;
                break;
            }
            case (2): {
                const value = Math.trunc(propgress / 3);
                original = value + 1;
                translated = value + 1;
                writed = value;
                break;
            }
        }
        return { translated, original, writed };
    }

    return <>
        <ExcelButton text='Import from excel' onClick={() => inputRef.current?.click()} >
            <input
                type='file'
                ref={inputRef}
                accept='.xlsx'
                style={{ display: 'none' }}
                onChange={(e) => handleUpload(e)}
            />
        </ExcelButton>
        <div className={s.import_info + ' ' + (fileName === notValidText ? s.not_valid : '')}>{fileName && fileName}</div>
    </>
}

type ExcelButtonProps = {
    text: string;
    onClick: () => void;
    children?: JSX.Element;
}

function ExcelButton(props: ExcelButtonProps) {
    return (
        <div className={s.excel_button} onClick={props.onClick}>
            <img src={Excel} alt='' />
            <span>{props.text}</span>
            {props.children}
        </div>
    )
}
