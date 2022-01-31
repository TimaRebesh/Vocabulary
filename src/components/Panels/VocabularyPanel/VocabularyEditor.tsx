import React, { useRef, useState } from 'react';
import * as XLSX from "xlsx"; // npm install xlsx
import s from './VocabularyPanel.module.css';
import edit from '../../../assets/images/edit_list.png'
import { Modal } from '../../../helpers/ComponentHelpers';
import { ThemeContext } from '../../Main';
import { Configurations, Vocabulary, VocMutation, Word } from '../../Types';
import { getVocabularyName, getWordProgress } from '../../../helpers/fucntionsHelp';
import Excel from '../../../assets/images/excel.png';
import { useGetConfigQuery, useUpdateConfigMutation } from '../../../API/configApi';
import { useUpdateVocabularyMutation, useUpdateVocabularyNameMutation } from '../../../API/vocabularyApi';

type VocabularyEditorProps = {
    voc: Word[];
}

export default function VocabularyEditor(props: VocabularyEditorProps) {

    const [isShowPopup, setShowPopup] = useState(false);

    return <>
        <img src={edit} className={s.edit_button} onClick={_ => setShowPopup(true)}></img>
        {isShowPopup &&
            <VocEditorModal
                voc={props.voc}
                show={isShowPopup}
                hide={() => setShowPopup(false)} />
        }
    </>
}

type VocEditorModalProps = {
    voc: Word[];
    show: boolean;
    hide: () => void;
}

export function VocEditorModal(props: VocEditorModalProps) {

    const config = useGetConfigQuery({}).data as Configurations;
    const [updateConfig] = useUpdateConfigMutation();
    const [updateName] = useUpdateVocabularyNameMutation();
    const [updateVocabulary] = useUpdateVocabularyMutation();
    const vocName = getVocabularyName(config);
    const [inputVal, setInputVal] = useState(vocName);
    const [importedVoc, setImportedVod] = useState<Word[]>([]);

    const save = async () => {
        const vocID = config.studyID;
        const isImportedVoc = importedVoc.length > 0;
        try {
            if (isImportedVoc) {
                const updatedVoc = {
                    id: vocID,
                    name: inputVal,
                    vocabulary: importedVoc
                }
                await updateVocabulary({
                    id: vocID,
                    data: updatedVoc
                })
            }
            if (inputVal !== vocName) {
                await updateConfig({
                    ...config,
                    vocabularies: config.vocabularies.map(topic => {
                        return topic.id === vocID ?
                            {
                                id: topic.id,
                                name: inputVal
                            }
                            : topic
                    })
                })
                if (!isImportedVoc)
                    await updateName({
                        id: vocID,
                        name: inputVal
                    })
            }
            props.hide();
        } catch (e) {

        }
    }

    return <Modal isShown={props.show}>
        <div className={s.ve_modal + ' ' + s[config.theme]}>
            <div className={s.ve_header}>
                <p>{vocName} vocabulary</p>
                <div className={s.ve_close} onClick={props.hide}>&times;</div>
            </div>
            <div className={s.ve_content}>
                <div>Edit name</div>
                <input type='text' value={inputVal} onChange={e => setInputVal(e.target.value)} />
                <ExportToExcel voc={props.voc} vocName={vocName} />
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
