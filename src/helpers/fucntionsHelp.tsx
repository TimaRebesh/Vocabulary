import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Configurations, Topic, Word } from "../components/Types";
import { setError } from "../store/reducers/errorSlice";

export const shuffle = (data: Word[]) => {
    const arr = [...data];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr
}

export const getWordProgress = (word: Word) =>
    word.repeated.original + word.repeated.translated + word.repeated.writed;

export const getVocabularyName = (config: Configurations) => {
    const topic = config.vocabularies.find(voc => voc.id === config.studyID) as Topic;
    return topic.name ?? '<empty>'
}

export const defineClass = (...names: string[]) => names.reduce((aggr: any, n) => n ? [...aggr, n] : [...aggr], []).join(' ');

export const checkSimilarityOfValues = (firstElement: any, secondElement: any) =>
    JSON.stringify(firstElement) === JSON.stringify(secondElement);

export const deepCopy = (value: any) => JSON.parse(JSON.stringify(value));

export const setErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined | null, requestName?: string) => {
    if (error) {
        const err = error as { data: any, status: number };
        const message = `Error by ${requestName ?? 'request'} (${err.status})`
        return setError(message)
    }
    return setError(null)
}