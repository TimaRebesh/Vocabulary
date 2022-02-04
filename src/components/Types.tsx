export type PanelName = string;
// 'menu' | 'repeat' | 'studyNew' | 'vocabulary' | 'settings' | 'addNew';

export type Repeated = {
    translated: number;
    original: number;
    writed: number;
}

export type Word = {
    id: number;
    original: string;
    anothers: string[],
    translated: string;
    repeated: Repeated;
    lastRepeat: number;
}

export type Topic = {
    id: number;
    name: string;
}

export type Vocabulary = {
    id: number;
    name: string;
    vocabulary: Word[];
}

export type Configurations = {
    studyID: number,
    vocabularies: Topic[];
    modeWrite: boolean;
    hints: boolean;
    limitAll: number;      // how many all words proctice in one session
    limitNew: number;      // how many new words proctice in one session
    theme: Theme;
}

export type NewConfig = {
    name: 'studyLang' | 'vocabularies' | 'studyTopic' | 'modeWrite' | 'limitAll' | 'limitNew' | 'hints' | 'theme';
    value: number | string | boolean | string[] | Topic;
}

export type Theme = 'white' | 'dark';

export type StudyingPanelProps = {
    config: Configurations;
    vocabulary: Word[];
    onSave: (value: Word[]) => void;
    setPanel: (panelName: PanelName) => void;
}

export type VocMutation = {
    name: string;
    vocWords: Word[] | null;
}
