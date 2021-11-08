import { dataConfigurations, IT, Oleg } from "../components/data"
import { Configurations, Word } from "../components/Types";

export const Api = {
    getConfig() {
        return new Promise((resolve, reject) => {
            if (!localStorage.getItem('config')) {
                localStorage.setItem('config', JSON.stringify(dataConfigurations))
                resolve(dataConfigurations)
            }
            const data = localStorage.getItem('config') as string;
            resolve(JSON.parse(data) as Configurations);

        });
    },

    getVocabulary(studyTopic: number) {
        if (!localStorage.getItem('100')) {
            localStorage.setItem('100', JSON.stringify(IT))
        }
        if (!localStorage.getItem('200'))
            localStorage.setItem('200', JSON.stringify(Oleg))
        // if (studyTopic === undefined)
            // localStorage.setItem(new Date().getTime(), )
        if (!localStorage.getItem(studyTopic.toString())) {
            localStorage.setItem(studyTopic.toString(), JSON.stringify([]))
        }
        return new Promise((resolve, reject) => {
            const data = localStorage.getItem(studyTopic.toString()) as string;
            resolve(JSON.parse(data) as Word[]);
        });
    },

    saveConfig(config: Configurations, removed: number[]) {
        if (removed.length) 
            removed.forEach(r => localStorage.removeItem(r.toString()))
        
        return new Promise((resolve, reject) => {
            localStorage.setItem('config', JSON.stringify(config));
            const data = localStorage.getItem('config') as string;
            resolve(JSON.parse(data) as Configurations);
        })
    },

    saveVocabulary(value: Word[], studyTopicID: number) {
        return new Promise((resolve, reject) => {
            localStorage.setItem(studyTopicID.toString(), JSON.stringify(value))
            const data = localStorage.getItem(studyTopicID.toString()) as string;
            resolve(JSON.parse(data) as Word[]);
        })
    }
}
